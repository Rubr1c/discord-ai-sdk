import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to rename a channel.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function renameChannelTool(guild: Guild): Tool {
  return tool({
    description: 'rename a channel',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
      newName: z
        .string()
        .min(1, 'Channel name cannot be empty')
        .max(100, 'Channel name too long')
        .describe('Channel name (lowercase, no spaces, use dashes between words)'),
    }),
    execute: async ({ channelId, newName }): Promise<ToolResult> => {
      const channelName = newName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-_]/g, '')
        .replace(/^-+|-+$/g, '');

      const channel = await guild.channels.fetch(channelId);

      await channel?.edit({ name: channelName });

      return { summary: `Edited channel name of channel [${channelId}] to ${channelName}` };
    },
  });
}
