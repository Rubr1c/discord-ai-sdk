import type { ToolResult } from '@/index';
import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';

/**
 * Creates a tool to delete a thread.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function deleteThreadTool(guild: Guild): Tool {
  return tool({
    description: 'delete a thread',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
      threadName: z.string().describe('thread name'),
    }),
    execute: async ({ channelId, threadName }): Promise<ToolResult> => {
      try {
        const channel = await guild.channels.fetch(channelId);
        if (!channel) {
          return { summary: `Channel ${channelId} not found` };
        }

        if (channel.type !== ChannelType.GuildText) {
          return { summary: `Channel ${channelId} is not a text channel` };
        }

        const thread = (await channel.threads.fetch()).threads.find(
          (thread) => thread.name === threadName,
        );

        if (!thread) {
          return { summary: `Thread ${threadName} not found` };
        }

        await thread.delete();

        return { summary: `Deleted thread ${threadName}` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to delete thread ${threadName}: ${message}` };
      }
    },
  });
}
