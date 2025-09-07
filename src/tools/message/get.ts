import { tool, type Tool } from 'ai';
import { type FetchMessagesOptions, type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function getMessagesTool(guild: Guild): Tool {
  return tool({
    description: 'fetch messages from a channel with optional filtering',
    inputSchema: z.object({
      channelId: z.string().describe('id of channel'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)
        .describe('how many messages to fetch (1-100)'),
      before: z.string().optional().describe('get messages before this message ID'),
      after: z.string().optional().describe('get messages after this message ID'),
      around: z.string().optional().describe('get messages around this message ID'),
    }),
    execute: async ({ channelId, limit, before, after, around }): Promise<ToolResult> => {
      const channel = await guild.channels.fetch(channelId);
      if (!channel?.isTextBased()) {
        return { summary: `Channel ${channelId} is not a text channel` };
      }

      const fetchOptions: FetchMessagesOptions = { limit };
      if (before) fetchOptions.before = before;
      if (after) fetchOptions.after = after;
      if (around) fetchOptions.around = around;

      const messages = await channel.messages.fetch(fetchOptions);

      const messageList = Array.from(messages.values()).map((msg) => ({
        id: msg.id,
        author: {
          username: msg.author.username,
        },
        content: msg.content,
        timestamp: msg.createdAt.toISOString(),
      }));

      return {
        summary: `Fetched ${messageList.length} messages from #${channel.name}`,
        data: messageList,
      };
    },
  });
}
