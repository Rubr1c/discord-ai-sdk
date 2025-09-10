/**
 * The result of a tool.
 * @param T - The type of the data.
 */
export interface ToolResult<T = unknown> {
  summary: string;
  data?: T;
}
