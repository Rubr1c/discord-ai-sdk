import { generateText, stepCountIs, type LanguageModel } from 'ai';
import { type LLMResult, type RequestContext } from './types';
import { RateLimiter } from './rate-limiter';
import { ToolRegistry } from './tool-registry';
import { PromptBuilder } from './prompt-builder';
import { AIError } from './error';
import { discordApiTools } from '../tools';

export interface AIEngineProps {
  model: LanguageModel;
  promptBuilder?: PromptBuilder;
  toolRegistry?: ToolRegistry;
  rateLimiter?: RateLimiter;
  maxSteps?: number;
  maxRetries?: number;
  temperature?: number;
  maxTokens?: number;
}

export class AIEngine {
  private config: Required<AIEngineProps>;

  constructor({ ...params }: AIEngineProps) {
    this.config = {
      model: params.model,
      promptBuilder: params.promptBuilder || new PromptBuilder(),
      toolRegistry: params.toolRegistry || new ToolRegistry(discordApiTools),
      rateLimiter: params.rateLimiter || new RateLimiter(3, 60000),
      maxRetries: params.maxRetries || 2,
      maxSteps: params.maxSteps || 5,
      temperature: params.temperature || 0,
      maxTokens: params.maxTokens || 400,
    };
  }

  public async handle(
    prompt: string,
    ctx: RequestContext,
    postProcess = true
  ): Promise<string> {
    if (
      ctx.guild.ownerId !== ctx.userId &&
      this.config.rateLimiter.isRateLimited(ctx.userId)
    ) {
      throw new AIError('RATE_LIMIT', `User[${ctx.userId}] is rate limited`);
    }

    const res = await this.callModel(prompt, ctx);

    if (postProcess) {
      return this.postProcess(res);
    }
    return res.text;
  }

  public async callModel(
    prompt: string,
    ctx: RequestContext
  ): Promise<LLMResult> {
    const prompts = this.config.promptBuilder.build(prompt, ctx);

    const result = await generateText({
      model: this.config.model,
      prompt: prompts.prompt,
      system: prompts.system,
      tools: Object.fromEntries(
        Object.entries(
          await this.config.toolRegistry.getAllAvailableTools(ctx)
        ).map(([name, aiTool]) => [name, aiTool.tool(ctx.guild)])
      ),
      maxRetries: this.config.maxRetries,
      stopWhen: stepCountIs(this.config.maxSteps),
      temperature: this.config.temperature,
      maxOutputTokens: this.config.maxTokens,
    });

    return {
      text: result.text,
      toolResults: result.toolResults?.map((tr) => ({
        toolName: tr.toolName,
        result: tr,
      })),
    };
  }

  public postProcess(result: LLMResult): string {
    if (result.text && result.text.trim() !== '') {
      return result.text;
    }

    if (result.toolResults && result.toolResults.length > 0) {
      const toolSummary = result.toolResults
        .map((toolResult) => {
          const resultValue =
            toolResult.result?.result ||
            toolResult.result?.output ||
            toolResult.result ||
            'Tool executed successfully';

          const formattedResult =
            typeof resultValue === 'string'
              ? resultValue
              : JSON.stringify(resultValue);

          return `✅ **${toolResult.toolName}**: ${formattedResult}`;
        })
        .join('\n\n');

      return `I've completed the following actions:\n\n${toolSummary}`;
    }

    return "I received your request but couldn't generate a proper response. Please try rephrasing your request.";
  }
}
