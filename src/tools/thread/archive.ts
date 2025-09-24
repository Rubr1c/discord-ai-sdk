import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to archive a thread.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function archiveThreadTool(guild: Guild): Tool {
  return tool({
    description: 'archive a thread',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
      threadName: z.string().describe('thread name'),
      archived: z.boolean().describe('archived status'),
    }),
    execute: async ({ channelId, threadName, archived }): Promise<ToolResult> => {
      try {
        const channel = await guild.channels.fetch(channelId);

        if (!channel) {
          return { summary: `Thread ${channelId} not found` };
        }

        if (channel.type !== ChannelType.GuildText) {
          return { summary: `Thread ${channelId} is not a text channel` };
        }

        const thread = (await channel.threads.fetch()).threads.find(
          (thread) => thread.name === threadName,
        );

        if (!thread) {
          return { summary: `Thread ${threadName} not found` };
        }
        
        await thread.setArchived(archived);
        return { summary: `Archived thread ${threadName} ${archived ? 'true' : 'false'}` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to archive thread ${threadName}: ${message}` };
      }
    },
  });
}
