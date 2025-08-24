import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';

export function createChannelTool(guild: Guild): Tool {
  return tool({
    description: 'create a discord channel',
    inputSchema: z.object({
      channelName: z
        .string()
        .min(1, 'Channel name cannot be empty')
        .max(100, 'Channel name too long')
        .describe(
          'Channel name (lowercase, no spaces, use dashes between words)'
        ),
      //TODO:
      //catagory: z.string().optional().describe('channel category'),
    }),
    execute: async ({ channelName }) => {
      // Clean and format the channel name
      const cleanName = channelName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-_]/g, '')
        .replace(/^-+|-+$/g, '');

      const channel = await guild.channels.create({
        name: cleanName,
        type: ChannelType.GuildText,
      });

      return `Created channel: ${channel.name}`;
    },
  });
}
