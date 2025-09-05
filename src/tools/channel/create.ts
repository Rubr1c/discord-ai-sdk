import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';

export function createChannelTool(guild: Guild): Tool {
  return tool({
    description:
      'Create a Discord text channel, optionally in a specific category. Use getCategories first if you need to find a category by name.',
    inputSchema: z.object({
      channelName: z
        .string()
        .min(1, 'Channel name cannot be empty')
        .max(100, 'Channel name too long')
        .describe('Channel name (lowercase, no spaces, use dashes between words)'),
      category: z
        .string()
        .nullable()
        .describe(
          'Category ID where the channel should be created. Use the ID from getCategories tool output.',
        ),
    }),
    execute: async ({ channelName, category }) => {
      // Clean and format the channel name
      const cleanName = channelName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-_]/g, '')
        .replace(/^-+|-+$/g, '');

      const channel = await guild.channels.create({
        name: cleanName,
        type: ChannelType.GuildText,
        parent: category,
      });

      return `Created channel: ${channel.name}`;
    },
  });
}
