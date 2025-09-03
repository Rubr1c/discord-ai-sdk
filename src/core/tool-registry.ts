import type { AITool, Safety } from './types';
import { SAFETY } from './types';

export class ToolRegistry<
  TInitialTools extends Record<string, AITool> = Record<string, AITool>
> {
  private tools: Record<string, AITool>;
  private safetyModeCap: Safety = 'high';

  constructor(tools: TInitialTools = {} as TInitialTools) {
    this.tools = tools;
  }

  public addTool(name: string, tool: AITool, overwrite = false): void {
    if (!overwrite && this.hasTool(name)) {
      throw new Error(`Tool "${name}" already exists`);
    }
    this.tools[name] = tool;
  }

  public removeTool(name: keyof TInitialTools | (string & {})): boolean {
    const toolName = name as string;
    if (this.hasTool(toolName)) {
      delete this.tools[toolName];
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

  public getAllAvailableTools(): Readonly<Record<string, AITool>> {
    const currentSafetyLevel = SAFETY[this.safetyModeCap];
    const availableTools: Record<string, AITool> = {};

    for (const [toolName, tool] of Object.entries(this.tools)) {
      const toolSafetyLevel = SAFETY[tool.safetyLevel];
      if (toolSafetyLevel <= currentSafetyLevel) {
        availableTools[toolName] = tool;
      }
    }

    return Object.freeze(availableTools);
  }

  public getAllTools(): Readonly<Record<string, AITool>> {
    let allTools = { ...this.tools };

    return Object.freeze(allTools);
  }

  public setSafetyModeCap(mode: Safety) {
    this.safetyModeCap = mode;
  }

  public getSafetyModeCap(): Safety {
    return this.safetyModeCap;
  }
}
