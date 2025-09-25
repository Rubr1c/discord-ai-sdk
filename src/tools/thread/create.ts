import { tool, type Tool } from 'ai';
import { ChannelType, ThreadAutoArchiveDuration, type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to create a thread.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function createThreadTool(guild: Guild): Tool {
  return tool({
    description: 'create a thread',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
      name: z.string().describe('name of the thread'),
      autoArchiveDuration: z
        .enum(Object.values(ThreadAutoArchiveDuration) as [string, ...string[]])
        .describe('auto archive duration')
        .default('OneWeek'),
    }),
    execute: async ({ channelId, name, autoArchiveDuration }): Promise<ToolResult> => {
      try {
        const channel = await guild.channels.fetch(channelId);
        if (!channel) {
          return { summary: `Channel ${channelId} not found` };
        }

        if (channel.type !== ChannelType.GuildText) {
          return { summary: `Channel ${channelId} is not a text channel` };
        }

        const thread = await channel.threads.create({
          name,
          autoArchiveDuration:
            ThreadAutoArchiveDuration[
              autoArchiveDuration as keyof typeof ThreadAutoArchiveDuration
            ],
        });

        return { summary: `Thread "${name}" created successfully with ID: ${thread.id}` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to create thread: ${message}` };
      }
    },
  });
}
