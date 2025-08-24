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
        .regex(
          /^[a-z0-9\-_]+$/,
          'Channel name must only contain lowercase letters, numbers, dashes, and underscores'
        )
        .refine(
          (name) => !name.includes(' '),
          'Channel name cannot contain spaces - use dashes instead'
        )
        .refine(
          (name) => !name.startsWith('-') && !name.endsWith('-'),
          'Channel name cannot start or end with dashes'
        )
        .transform((name) => name.toLowerCase().replace(/\s+/g, '-'))
        .describe(
          'Channel name (lowercase, no spaces, use dashes between words)'
        ),
      //TODO:
      //catagory: z.string().optional().describe('channel category'),
    }),
    execute: async ({ channelName }) => {
      const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
      });

      return `Created channel: ${channel.name}`;
    },
  });
}
