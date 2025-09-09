import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function unbanMemberTool(guild: Guild): Tool {
  return tool({
    description: 'unban a member from the server',
    inputSchema: z.object({
      userId: z.string().describe('id of target user'),
      reason: z.string().nullable().describe('reason for unban'),
    }),
    execute: async ({ userId, reason }): Promise<ToolResult> => {
      try {
        await guild.members.unban(userId, reason || 'No Reason Provided');

        return { summary: `Unbanned user ${userId}` };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'unknown error';
        return { summary: `Failed to unban ${userId}: ${message}` };
      }
    },
  });
}
