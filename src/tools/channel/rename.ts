import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';

export function renameChannelTool(guild: Guild): Tool {
  return tool({
    description: 'rename a channel',
    inputSchema: z.object({
      id: z.string().describe('channel id'),
      new_name: z
        .string()
        .min(1, 'Channel name cannot be empty')
        .max(100, 'Channel name too long')
        .describe('Channel name (lowercase, no spaces, use dashes between words)'),
    }),
    execute: async ({ id, new_name }) => {
      const channelName = new_name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-_]/g, '')
        .replace(/^-+|-+$/g, '');

      const channel = await guild.channels.fetch(id);

      await channel?.edit({ name: channelName });

      return `Edited channel name of channel [${id}] to ${channelName}`;
    },
  });
}
