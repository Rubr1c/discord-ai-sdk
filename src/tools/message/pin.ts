import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function pinMessageTool(guild: Guild): Tool {
  return tool({
    description: 'pin a message',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
      messageId: z.string().describe('message id'),
    }),
    execute: async ({ messageId, channelId }): Promise<ToolResult> => {
      const channel = await guild.channels.fetch(channelId);

      if (!channel?.isTextBased()) {
        return { summary: `Channel ${channelId} is not a text channel` };
      }

      const message = await channel.messages.fetch(messageId);

      await message.pin();

      return { summary: `Pinned message ${messageId}` };
    },
  });
}
