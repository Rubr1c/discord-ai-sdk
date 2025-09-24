import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to fetch existing channel categories.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function getCategoriesTool(guild: Guild): Tool {
  return tool({
    description: 'fetch existing channel categories',
    inputSchema: z.object({}),
    execute: async (): Promise<ToolResult> => {
      try {
        const channels = await guild.channels.fetch();
        const categories = channels.filter((channel) => channel?.type == ChannelType.GuildCategory);

        const categoryList = categories.map((category) => ({
          id: category?.id,
          name: category?.name,
          position: category?.position,
        }));

        return {
          summary: `Found ${categoryList.length} categories in this server`,
          data: categoryList,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to fetch categories: ${message}` };
      }
    },
  });
}
