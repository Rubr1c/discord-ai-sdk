import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function moveChannelTool(guild: Guild): Tool {
  return tool({
    description: 'move channel (reorder / move into category)',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
      position: z.number().int().describe('position in catagory'),
      categoryId: z
        .string()
        .nullable()
        .describe(
          'Category ID where the channel should be created. Use the ID from getCategories tool output.',
        ),
    }),
    execute: async ({ channelId, position, categoryId }) => {
      const channel = await guild.channels.fetch(channelId);

      await channel?.edit({ position, parent: categoryId });

      return `Moved channel to ${categoryId ?? ''} position ${position}`;
    },
  });
}
