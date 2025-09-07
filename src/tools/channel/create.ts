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
        .optional()
        .describe(
          'Category ID where the channel should be created. Use the ID from getCategories tool output.',
        ),
    }),
    execute: async ({ channelName, category }) => {
      try {
        // Clean and format the channel name
        const cleanName = channelName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\-_]/g, '')
          .replace(/^-+|-+$/g, '');

        if (!cleanName) {
          throw new Error('Channel name is invalid after cleaning');
        }

        // Validate category exists if provided
        if (category) {
          const categoryChannel = await guild.channels.fetch(category).catch(() => null);
          if (!categoryChannel || categoryChannel.type !== ChannelType.GuildCategory) {
            throw new Error(`Category with ID ${category} not found or is not a category`);
          }
        }

        const channel = await guild.channels.create({
          name: cleanName,
          type: ChannelType.GuildText,
          parent: category || null,
        });

        return `Successfully created channel: #${channel.name} (ID: ${channel.id})${category ? ` in category ${category}` : ''}`;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to create channel: ${errorMsg}`);
      }
    },
  });
}
