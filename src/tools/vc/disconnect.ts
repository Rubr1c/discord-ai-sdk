import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to disconnect a member from the server.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function disconnectMemberTool(guild: Guild): Tool {
  return tool({
    description: 'disconnect a member from the server',
    inputSchema: z.object({
      userId: z.string().describe('id of target user'),
    }),
    execute: async ({ userId }): Promise<ToolResult> => {
      try {
        const member = await guild.members.fetch(userId);
        await member.voice.disconnect();
        return { summary: `Disconnected member ${userId}` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to disconnect member ${userId}: ${message}` };
      }
    },
  });
}
