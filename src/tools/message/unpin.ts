import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to unpin a message.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function unpinMessageTool(guild: Guild): Tool {
  return tool({
    description: 'unpin a message',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
      messageId: z.string().describe('message id'),
    }),
    execute: async ({ messageId, channelId }): Promise<ToolResult> => {
      try {
        const channel = await guild.channels.fetch(channelId);
        if (!channel) {
          return { summary: `Channel ${channelId} not found` };
        }
        if (!channel.isTextBased()) {
          return { summary: `Channel ${channelId} is not a text channel` };
        }

        const message = await channel.messages.fetch(messageId);
        await message.unpin('Unpinned via tool');
        return { summary: `Unpinned message ${messageId}` };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        return { summary: `Failed to unpin message ${messageId}: ${msg}` };
      }
    },
  });
}
