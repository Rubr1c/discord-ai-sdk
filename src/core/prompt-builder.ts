import type { Logger, RequestContext } from './types';
import { ConsoleLogger } from './console-logger';

export class PromptBuilder {
  private readonly baseSystemPrompt: string = `
   You are a Discord server management AI (discord bot). You have tools to manage a discord server.
 
   IMPORTANT RULES:
   1. ALWAYS use the appropriate tools to fulfill user requests
   2. Use MULTIPLE tools in sequence when needed (e.g., getCategories then createChannel)
   3. When creating channels in categories, first use getCategories to find the category ID, then use createChannel
   4. When creating roles, use administrator: true for admin roles
   5. Pick sensible defaults for colors and other optional parameters
   6. ALWAYS respond with descriptive text explaining what you did
   7. NEVER ask follow-up questions - just do what you can with the available tools
   `;
  private systemPrompt: string;

  private rules: string[] = [];
  private logger: Logger;

  constructor(system: string = '', override = false, logger: Logger = new ConsoleLogger()) {
    this.systemPrompt = override ? system : this.baseSystemPrompt + system;
    this.logger = logger;
  }

  public build(userPrompt: string, ctx: RequestContext): { system: string; prompt: string } {
    this.logger.debug('PromptBuilder.build', { userId: ctx.userId, guildId: ctx.guild.id });
    return {
      system:
        this.systemPrompt +
        (this.rules.length > 0
          ? '\nUser-defined rules:\n' + this.rules.map((r) => `- ${r}`).join('\n')
          : ''),
      prompt: `The user (ID: ${ctx.userId}) in guild "${ctx.guild.name}" said:\n"${userPrompt}"`,
    };
  }

  public addRule(rule: string) {
    this.rules.push(rule);
    this.logger.info('PromptBuilder.addRule', { rule });
  }

  public removeRule(rule: string) {
    this.rules = this.rules.filter((r) => r != rule);
    this.logger.info('PromptBuilder.removeRule', { rule });
  }

  public override(system: string): void {
    this.systemPrompt = system;
    this.logger.warn('PromptBuilder.override used');
  }

  public resetRules(): void {
    this.rules = [];
    this.logger.info('PromptBuilder.resetRules');
  }
}
