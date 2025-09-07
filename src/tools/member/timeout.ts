import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function timeoutMemberTool(guild: Guild): Tool {
  return tool({
    description: 'timeout a member in the server',
    inputSchema: z.object({
      userId: z.string().describe('id of target user'),
      reason: z.string().nullable().describe('reason for timeout'),
      duration: z.number().describe('duration of timeout in ms'),
    }),
    execute: async ({ userId, reason, duration }): Promise<ToolResult> => {
      const user = await guild.members.fetch(userId);

      await user.timeout(duration, reason ?? '');

      return { summary: `Timed out user ${userId} for ${duration}ms` };
    },
  });
}
