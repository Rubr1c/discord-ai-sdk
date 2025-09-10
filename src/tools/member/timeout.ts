import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

/**
 * Creates a tool to timeout a member.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function timeoutMemberTool(guild: Guild): Tool {
  return tool({
    description: 'timeout a member in the server',
    inputSchema: z.object({
      userId: z
        .string()
        .regex(/^\d{17,20}$/)
        .describe('Discord user snowflake'),
      reason: z.string().max(512).optional().describe('audit log reason (<=512 chars)'),
      duration: z.coerce
        .number()
        .int()
        .min(5_000)
        .max(2_419_200_000)
        .describe('duration in ms (5s–28d)'),
    }),
    execute: async ({ userId, reason, duration }): Promise<ToolResult> => {
      const user = await guild.members.fetch(userId);

      await user.timeout(duration, reason ?? '');

      return { summary: `Timed out user ${userId} for ${duration}ms` };
    },
  });
}
