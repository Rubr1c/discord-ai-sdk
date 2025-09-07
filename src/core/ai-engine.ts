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
    this.promptBuilder =
      params.promptBuilder || new PromptBuilder('', false, params.logger ?? new ConsoleLogger());
    this.toolRegistry =
      params.toolRegistry ||
      new ToolRegistry({
        tools: discordApiTools,
        ...(params.logger ? { logger: params.logger } : {}),
      });
    this.rateLimiter = params.rateLimiter || new RateLimiter({ limitCount: 3, windowMs: 60000 });
    this.logger = params.logger ?? new ConsoleLogger();
    this.config = {
      maxRetries: params.maxRetries ?? 2,
      maxSteps: params.maxSteps ?? 5,
      temperature: params.temperature ?? 0,
      maxTokens: params.maxTokens ?? 400,
    };
  }

  public async handle(prompt: string, ctx: RequestContext, postProcess = true): Promise<string> {
    this.logger.debug('AIEngine.handle invoked', { userId: ctx.userId, guildId: ctx.guild.id });
    if (await this.rateLimiter.isRateLimited(ctx)) {
      const err = new AIError('RATE_LIMIT', `User[${ctx.userId}] is rate limited`);
      this.logger.warn('Rate limited request', { userId: ctx.userId, guildId: ctx.guild.id });
      throw err;
    }

    const res = await this.callModel(prompt, ctx);

    if (postProcess) {
      const text = this.postProcess(res);
      this.logger.debug('AIEngine.postProcess completed');
      return text;
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

      this.logger.info('AIEngine.callModel completed', {
        toolResults: !!result.toolResults,
        toolCount: result.toolResults?.length || 0,
        hasText: !!result.text?.trim(),
      });

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
    this.logger.debug('AIEngine.postProcess', {
      hasText: !!result.text?.trim(),
      toolResultsCount: result.toolResults?.length || 0,
    });

    if (result.text && result.text.trim() !== '') {
      return result.text;
    }

    if (result.toolResults && result.toolResults.length > 0) {
      const toolSummary = result.toolResults
        .map((toolResult) => {
          if (toolResult.result?.error) {
            this.logger.warn('Tool execution error', {
              toolName: toolResult.toolName,
              error: toolResult.result.error,
            });
            return `**${toolResult.toolName}**: Error - ${toolResult.result.error}`;
          }

          const resultValue =
            toolResult.result?.result ||
            toolResult.result?.output ||
            toolResult.result ||
            'Tool executed successfully';

          const formattedResult =
            typeof resultValue === 'string' ? resultValue : JSON.stringify(resultValue);

          return `**${toolResult.toolName}**: ${formattedResult}`;
        })
        .join('\n\n');

      return `I've completed the following actions:\n\n${toolSummary}`;
    }

    this.logger.warn('AIEngine.postProcess: No text or tool results to process');
    return "I received your request but couldn't generate a proper response. This might be due to a tool execution error or the AI model not calling the appropriate tools. Please try rephrasing your request or check if you have the necessary permissions.";
  }
}
