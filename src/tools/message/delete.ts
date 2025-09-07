import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function deleteMessageTool(guild: Guild): Tool {
  return tool({
    description: 'delete a message in a channel',
    inputSchema: z.object({
      channelId: z.string().describe('id of channel'),
      messageId: z.string().describe('id of message'),
    }),
    execute: async ({ channelId, messageId }): Promise<ToolResult> => {
      const channel = await guild.channels.fetch(channelId);

      if (!channel?.isTextBased()) {
        return { summary: `Channel ${channelId} is not a text channel` };
      }

      const msg = await channel.messages.fetch(messageId);

      await msg.delete();

      return { summary: `Deleted message ${messageId}` };
    },
  });
}
