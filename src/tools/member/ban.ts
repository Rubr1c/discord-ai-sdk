import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function banMemberTool(guild: Guild): Tool {
  return tool({
    description: 'ban a member from the server',
    inputSchema: z.object({
      userId: z.string().describe('id of target user'),
      reason: z.string().nullable().describe('reason for ban'),
    }),
    execute: async ({ userId, reason }): Promise<ToolResult> => {
      const user = await guild.members.fetch(userId);

      await user.ban({ reason: reason || 'No Reason Provided' });

      return { summary: `Banned user ${userId}` };
    },
  });
}
