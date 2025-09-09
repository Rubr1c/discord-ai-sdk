import { generateText, stepCountIs, type LanguageModel } from 'ai';
import { type Logger, type RequestContext } from './types';
import { RateLimiter } from './rate-limiter';
import { ToolRegistry } from './tool-registry';
import { PromptBuilder } from './prompt-builder';
import { AIError } from './error';
import { discordApiTools } from '../tools';
import { ConsoleLogger } from './console-logger';

export interface AIEngineProps {
  model: LanguageModel;
  promptBuilder?: PromptBuilder;
  toolRegistry?: ToolRegistry;
  rateLimiter?: RateLimiter;
  maxSteps?: number;
  maxRetries?: number;
  temperature?: number;
  maxTokens?: number;
  logger?: Logger;
}

export interface LLMResult {
  text: string;
  toolResults?: {
    toolName: string;
    result: any;
  }[];
}

export class AIEngine {
  private model: LanguageModel;
  private promptBuilder: PromptBuilder;
  private toolRegistry: ToolRegistry;
  private rateLimiter: RateLimiter;
  private logger: Logger;
  private config: {
    maxRetries: number;
    maxSteps: number;
    temperature: number;
    maxTokens: number;
  };

  constructor(params: AIEngineProps) {
    this.model = params.model;
    this.logger = params.logger ?? new ConsoleLogger();
    this.promptBuilder = params.promptBuilder || new PromptBuilder('', false, this.logger);
    this.toolRegistry =
      params.toolRegistry ||
      new ToolRegistry({
        tools: discordApiTools,
        logger: this.logger,
      });
    this.rateLimiter =
      params.rateLimiter ||
      new RateLimiter({ limitCount: 3, windowMs: 60000, logger: this.logger });

    this.config = {
      maxRetries: params.maxRetries ?? 2,
      maxSteps: params.maxSteps ?? 5,
      temperature: params.temperature ?? 0,
      maxTokens: params.maxTokens ?? 400,
    };
  }

  public async handle(prompt: string, ctx: RequestContext, postProcess = true): Promise<string> {
    if (await this.rateLimiter.isRateLimited(ctx)) {
      const err = new AIError('RATE_LIMIT', `User[${ctx.userId}] is rate limited`);
      throw err;
    }

    const res = await this.callModel(prompt, ctx);

    if (postProcess) {
      return this.postProcess(res);
    }
    return res.text;
  }

  public async callModel(prompt: string, ctx: RequestContext): Promise<LLMResult> {
    const prompts = this.promptBuilder.build(prompt, ctx);

    try {
      const result = await generateText({
        model: this.model,
        prompt: prompts.prompt,
        system: prompts.system,
        tools: Object.fromEntries(
          Object.entries(await this.toolRegistry.getAllAvailableTools(ctx)).map(
            ([name, aiTool]) => [name, aiTool.tool(ctx.guild)],
          ),
        ),
        maxRetries: this.config.maxRetries,
        stopWhen: stepCountIs(this.config.maxSteps),
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      });

      this.logger.info('AIEngine.callModel completed');

      return {
        text: result.text,
        toolResults: result.toolResults?.map((tr) => ({
          toolName: tr.toolName,
          result: tr,
        })),
      };
    } catch (error) {
      this.logger.error('AIEngine.callModel failed', error as Error);
      throw new AIError(
        'MODEL_ERROR',
        `Model execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  public postProcess(result: LLMResult): string {
    if (result.text && result.text.trim() !== '') {
      return result.text;
    }

    if (result.toolResults && result.toolResults.length > 0) {
      const lines = result.toolResults.map((toolResult) => {
        const summary = this.extractToolRunSummary(toolResult.result);
        return `**${toolResult.toolName}**: ${summary}`;
      });
      return `I've completed the following actions:\n\n${lines.join('\n\n')}`;
    }

    return "I received your request but couldn't generate a proper response. This might be due to a tool execution error or the AI model not calling the appropriate tools. Please try rephrasing your request or check if you have the necessary permissions.";
  }

  private extractToolRunSummary(toolRun: unknown): string {
    if (
      this.isRecord(toolRun) &&
      typeof toolRun.error === 'string' &&
      toolRun.error.trim() !== ''
    ) {
      return `Error - ${toolRun.error}`;
    }

    const nested = this.pickFirst(toolRun, ['result', 'output']);
    if (
      this.isRecord(nested) &&
      typeof nested.summary === 'string' &&
      nested.summary.trim() !== ''
    ) {
      return nested.summary;
    }

    if (typeof nested === 'string' && nested.trim() !== '') return nested;
    if (typeof toolRun === 'string' && toolRun.trim() !== '') return toolRun;

    return 'Tool executed successfully';
  }

  private isRecord(value: unknown): value is Record<string, any> {
    return typeof value === 'object' && value !== null;
  }

  private pickFirst(source: unknown, keys: string[]): unknown {
    if (!this.isRecord(source)) return undefined;
    for (const key of keys) {
      if (key in source) return source[key];
    }
    return undefined;
  }
}
