import { vcTools } from './vc';
import { channelTools } from './channel';
import { categoryTools } from './category';
import { roleTools } from './role';
import { memberTools } from './member';
import { messageTools } from './message';
import { serverTools } from './server';
import { reactionTools } from './reaction';
import { threadTools } from './thread';
import type { ToolFactory } from '@/tools/types';
/**
 * Creates a tool.
 * @param tool - The tool factory.
 * @param safetyLevel - The safety level.
 * @returns The tool.
 */
export function createTool(toolFactory: ToolFactory) {
  return { tool: toolFactory.tool, safetyLevel: toolFactory.safetyLevel };
}

/**
 * The Discord API tools.
 */
export const discordApiTools = {
  vcTools,
  channelTools,
  categoryTools,
  roleTools,
  memberTools,
  messageTools,
  serverTools,
  reactionTools,
  threadTools,
} satisfies Record<string, Record<string, ToolFactory>>;
