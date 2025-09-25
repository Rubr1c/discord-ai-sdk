import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

export function getReactionsTool(guild: Guild): Tool {
  return tool({
    description: 'fetch reactions from a message',
    inputSchema: z.object({
      channelId: z.string().describe('id of channel'),
      messageId: z.string().describe('id of message'),
    }),
    execute: async ({ channelId, messageId }): Promise<ToolResult> => {
      try {
        const channel = await guild.channels.fetch(channelId);
        if (!channel?.isTextBased()) {
          return { summary: `Channel ${channelId} is not a text channel` };
        }
        const message = await channel.messages.fetch(messageId);

        const reactions = message.reactions.cache.map((reaction) => ({
          id: reaction.emoji.id,
          name: reaction.emoji.name,
          count: reaction.count,
        }));

        return { summary: `Fetched reactions from message ${messageId}`, data: reactions };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to fetch reactions from message ${messageId}: ${errorMessage}` };
      }
    },
  });
}
