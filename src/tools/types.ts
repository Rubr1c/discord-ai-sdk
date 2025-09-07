export interface ToolResult<T = unknown> {
  summary: string;
  data?: T;
}
