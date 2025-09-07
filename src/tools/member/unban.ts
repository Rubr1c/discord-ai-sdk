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
      await guild.members.unban(userId, reason || 'No Reason Provided');

      return { summary: `Unbanned user ${userId}` };
    },
  });
}
