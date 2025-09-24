import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to remove a role from a user.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function removeRoleTool(guild: Guild): Tool {
  return tool({
    description: 'remove role from user',
    inputSchema: z.object({
      roleId: z.string().describe('id of role'),
      userId: z.string().describe('id of user'),
    }),
    execute: async ({ roleId, userId }): Promise<ToolResult> => {
      try {
        const user = await guild.members.fetch(userId);
        await user.roles.remove(roleId);

        return { summary: `Removed role ${roleId} from ${userId}` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to remove role ${roleId} from ${userId}: ${message}` };
      }
    },
  });
}
