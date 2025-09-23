import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to assign a role to a user.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function assignRoleTool(guild: Guild): Tool {
  return tool({
    description: 'assign role to user',
    inputSchema: z.object({
      roleId: z.string().describe('id of role'),
      userId: z.string().describe('id of user'),
    }),
    execute: async ({ roleId, userId }): Promise<ToolResult> => {
      const user = await guild.members.fetch(userId);
      await user.roles.add(roleId);

      return { summary: `Added role ${roleId} to ${userId}` };
    },
  });
}
