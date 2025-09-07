import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function deleteCategoryTool(guild: Guild): Tool {
  return tool({
    description: 'delete channel category',
    inputSchema: z.object({
      id: z.string().describe('id of the category'),
    }),
    execute: async ({ id }): Promise<ToolResult> => {
      try {
        const category = await guild.channels.fetch(id);
        if (!category) {
          return { summary: `Category ${id} not found` };
        }

        if (category.type !== ChannelType.GuildCategory) {
          return { summary: `Channel is not a category: ${id}` };
        }
        await category.delete();

        return { summary: `Deleted Category: ${id}` };
      } catch (err) {
        return { summary: `Failed to delete category ${id}: ${(err as Error).message}` };
      }
    },
  });
}
