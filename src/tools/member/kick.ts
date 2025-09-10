import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

/**
 * Creates a tool to kick a member.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function kickMemberTool(guild: Guild): Tool {
  return tool({
    description: 'kick a member from the server',
    inputSchema: z.object({
      userId: z.string().describe('id of target user'),
      reason: z.string().nullable().describe('reason for kick'),
    }),
    execute: async ({ userId, reason }): Promise<ToolResult> => {
      const normalizedReason = (reason ?? '').trim() || 'No reason provided';
      try {
        const user = await guild.members.fetch(userId);

        await user.kick(normalizedReason);

        return { summary: `Kicked user ${userId}` };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'unknown error';
        return { summary: `Failed to kick ${userId}: ${message}` };
      }
    },
  });
}
