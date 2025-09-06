import type { AITool, Logger, Safety } from './types';
import { SAFETY } from './types';
import type { RequestContext } from './types';
import { ConsoleLogger } from './console-logger';
import type { Guild } from 'discord.js';

export type ToolRegistryProps<
  TInitialTools extends Record<string, AITool> = Record<string, AITool>,
> = {
  tools?: TInitialTools;
  logger?: Logger;
  safetyModeCap?: ((guild: Guild) => Promise<Safety>) | Safety;
};

export class ToolRegistry<TInitialTools extends Record<string, AITool> = Record<string, AITool>> {
  private tools: Record<string, AITool>;
  private safetyModeCap: ((guild: Guild) => Promise<Safety>) | Safety = 'high';
  private logger: Logger;

  constructor({ tools, logger, safetyModeCap }: ToolRegistryProps<TInitialTools> = {}) {
    this.tools = (tools ?? {}) as TInitialTools;
    this.logger = logger ?? new ConsoleLogger();
    if (safetyModeCap) this.safetyModeCap = safetyModeCap;
  }

  public addTool(name: string, tool: AITool, overwrite = false): void {
    if (!overwrite && this.hasTool(name)) {
      throw new Error(`Tool "${name}" already exists`);
    }
    this.tools[name] = tool;
    this.logger.info('ToolRegistry.addTool', { name });
  }

  public removeTool(name: keyof TInitialTools | (string & {})): boolean {
    const toolName = name as string;
    if (this.hasTool(toolName)) {
      delete this.tools[toolName];
      this.logger.info('ToolRegistry.removeTool', { name: toolName });
      return true;
    }
    return false;
  }

  public listTools(): string[] {
    return Object.keys(this.tools);
  }

  public hasTool(name: string): boolean {
    return name in this.tools;
  }

  public getTool(name: string): AITool | undefined {
    return this.tools[name];
  }

  public async getAllAvailableTools(
    ctx: RequestContext,
  ): Promise<Readonly<Record<string, AITool>>> {
    const safetyMode =
      typeof this.safetyModeCap === 'function'
        ? await this.safetyModeCap(ctx.guild)
        : this.safetyModeCap;

    if (safetyMode === 'high') {
      this.logger.debug('ToolRegistry.getAllAvailableTools: high safety, returning all');
      return this.getAllTools();
    }

    const currentSafetyLevel = SAFETY[safetyMode];
    const availableTools: Record<string, AITool> = {};

    for (const [toolName, tool] of Object.entries(this.tools)) {
      const toolSafetyLevel = SAFETY[tool.safetyLevel];
      if (toolSafetyLevel <= currentSafetyLevel) {
        availableTools[toolName] = tool;
      }
    }

    this.logger.debug('ToolRegistry.getAllAvailableTools: filtered', {
      count: Object.keys(availableTools).length,
    });
    return Object.freeze(availableTools);
  }

  public getAllTools(): Readonly<Record<string, AITool>> {
    let allTools = { ...this.tools };
    this.logger.debug('ToolRegistry.getAllTools', { count: Object.keys(allTools).length });

    return Object.freeze(allTools);
  }

  public setSafetyModeCapFn(cap: ((guild: Guild) => Promise<Safety>) | Safety) {
    this.safetyModeCap = cap;
    this.logger.info('ToolRegistry.setSafetyModeCapFn');
  }
}
