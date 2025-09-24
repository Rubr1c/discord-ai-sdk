import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to fetch threads.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function getThreadsTool(guild: Guild): Tool {
  return tool({
    description: 'fetch threads',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
    }),
    execute: async ({ channelId }): Promise<ToolResult> => {
      try {
        const channel = await guild.channels.fetch(channelId);
        if (!channel) {
          return { summary: `Channel ${channelId} not found` };
        }
        if (channel.type !== ChannelType.GuildText) {
          return { summary: `Channel ${channelId} is not a text channel` };
        }
        const { threads, members } = await channel.threads.fetch();
        return { summary: `Fetched ${threads.size} threads`, data: { threads, members } };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to fetch threads: ${message}` };
      }
    },
  });
}
