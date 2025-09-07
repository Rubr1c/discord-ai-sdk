import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function deleteCategoryTool(guild: Guild): Tool {
  return tool({
    description: 'delete channel category',
    inputSchema: z.object({
      id: z.string().describe('id of the category'),
    }),
    execute: async ({ id }): Promise<ToolResult> => {
      const category = await guild.channels.fetch(id);
      await category?.delete();

      return { summary: `Deleted Category: ${id}` };
    },
  });
}
