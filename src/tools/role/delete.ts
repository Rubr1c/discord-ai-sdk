import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to delete a role.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function deleteRoleTool(guild: Guild): Tool {
  return tool({
    description: 'delete a role',
    inputSchema: z.object({
      id: z.string().describe('role id'),
    }),

    execute: async ({ id }): Promise<ToolResult> => {
      try {
        const role = await guild.roles.fetch(id);
        if (!role) {
          return { summary: `No role found for id ${id}.` };
        }

        if (role.id === guild.id) {
          return { summary: 'Cannot delete the @everyone role.' };
        }
        if (!role.editable) {
          return { summary: `Insufficient permissions to delete role ${role.name} (${id}).` };
        }
        const name = role.name;
        await role.delete();
        return { summary: `Deleted role ${name} (${id}).` };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('Unknown Role')) {
          return { summary: `Role ${id} not found.` };
        }
        return { summary: `Failed to delete role ${id}: ${msg}` };
      }
    },
  });
}
