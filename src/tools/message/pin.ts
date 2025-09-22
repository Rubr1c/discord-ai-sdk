import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to pin a message.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function pinMessageTool(guild: Guild): Tool {
  return tool({
    description: 'pin a message',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
      messageId: z.string().describe('message id'),
    }),
    execute: async ({ messageId, channelId }): Promise<ToolResult> => {
      const channel = await guild.channels.fetch(channelId);

      if (!channel) {
        return { summary: `Channel ${channelId} not found` };
      }

      if (!channel.isTextBased()) {
        return { summary: `Channel ${channelId} is not a text channel` };
      }

      try {
        const message = await channel.messages.fetch(messageId);
        if (message.pinned) {
          return { summary: `Message ${messageId} is already pinned` };
        }

        await message.pin();

        return { summary: `Pinned message ${messageId}` };
      } catch (err) {
        return { summary: `Failed to pin message ${messageId}: ${(err as Error).message}` };
      }
    },
  });
}
