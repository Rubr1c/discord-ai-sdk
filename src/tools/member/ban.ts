import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function banMemberTool(guild: Guild): Tool {
  return tool({
    description: 'ban a member from the server',
    inputSchema: z.object({
      userId: z
        .string()
        .regex(/^\d{17,20}$/, 'Invalid Discord user ID (snowflake)')
        .describe('Discord user ID of target user'),
      reason: z
        .string()
        .trim()
        .max(512, 'Reason must be <= 512 characters')
        .nullish()
        .describe('reason for ban'),
    }),
    execute: async ({ userId, reason }): Promise<ToolResult> => {
      const normalizedReason = (reason ?? '').trim() || 'No reason provided';
      try {
        await guild.members.ban(userId, { reason: normalizedReason });
        return { summary: `Banned user ${userId} (${normalizedReason})` };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'unknown error';
        return { summary: `Failed to ban ${userId}: ${message}` };
      }
    },
  });
}
