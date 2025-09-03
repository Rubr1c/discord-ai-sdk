import type { AITool } from './types';

export class ToolRegistry<
  TInitialTools extends Record<string, AITool> = Record<string, AITool>
> {
  private tools: Record<string, AITool>;

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

  public getAllTools(): Readonly<Record<string, AITool>> {
    let allTools = { ...this.tools };

    return Object.freeze(allTools);
  }
}
