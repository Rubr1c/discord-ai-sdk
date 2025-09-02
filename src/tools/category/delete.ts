import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function deleteCategoryTool(guild: Guild): Tool {
  return tool({
    description: 'delete channel category',
    inputSchema: z.object({
      id: z.string().describe('id of the category'),
    }),
    execute: async ({ id }) => {
      const category = await guild.channels.fetch(id);
      await category?.delete();

      return `Deleted Category: ${id}`;
    },
  });
}
