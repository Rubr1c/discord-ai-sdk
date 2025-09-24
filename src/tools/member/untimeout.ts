import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to remove timeout from a member.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function untimeoutMemberTool(guild: Guild): Tool {
  return tool({
    description: 'remove timeout from a member in the server',
    inputSchema: z.object({
      userId: z.string().describe('id of target user'),
    }),
    execute: async ({ userId }): Promise<ToolResult> => {
      try {
        const user = await guild.members.fetch(userId);

        await user.disableCommunicationUntil(null, 'Timeout removed');
        return { summary: `Removed timeout from user ${userId}` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to remove timeout from user ${userId}: ${message}` };
      }
    },
  });
}
