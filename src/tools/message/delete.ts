import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to delete a message.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function deleteMessageTool(guild: Guild): Tool {
  return tool({
    description: 'delete a message in a channel',
    inputSchema: z.object({
      channelId: z.string().describe('id of channel'),
      messageId: z.string().describe('id of message'),
    }),
    execute: async ({ channelId, messageId }): Promise<ToolResult> => {
      try {
        const channel = await guild.channels.fetch(channelId);
        if (!channel) {
          return { summary: `Channel ${channelId} not found` };
        }

        if (!channel.isTextBased()) {
          return { summary: `Channel ${channelId} is not a text channel` };
        }

        const msg = await channel.messages.fetch(messageId);
        await msg.delete();
        return { summary: `Deleted message ${messageId}` };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to delete message ${messageId}: ${message}` };
      }
    },
  });
}
