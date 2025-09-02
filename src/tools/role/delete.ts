import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function deleteRoleTool(guild: Guild): Tool {
  return tool({
    description: 'delete a role',
    inputSchema: z.object({
      id: z.string().describe('role id'),
    }),

    execute: async ({ id }) => {
      const role = await guild.roles.fetch(id);
      await role?.delete();

      return `Deleted role with id ${id}`;
    },
  });
}
