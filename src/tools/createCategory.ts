import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';

export function createCategoriesTools(guild: Guild): Tool {
  return tool({
    description: 'create channel category',
    inputSchema: z.object({
      name: z.string().describe('name of the category'),
    }),
    execute: async ({ name }) => {
      const category = await guild.channels.create({
        name: name,
        type: ChannelType.GuildCategory,
      });

      return `Created Category: ${category.name}`;
    },
  });
}
