import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to create a channel category.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function createCategoryTool(guild: Guild): Tool {
  return tool({
    description: 'create channel category',
    inputSchema: z.object({
      name: z.string().describe('name of the category'),
    }),
    execute: async ({ name }): Promise<ToolResult> => {
      const category = await guild.channels.create({
        name: name,
        type: ChannelType.GuildCategory,
      });

      return { summary: `Created Category: ${category.name}`, data: { id: category.id } };
    },
  });
}
