import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

/**
 * Creates a tool to send a message in a channel.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function sendMessageTool(guild: Guild): Tool {
  return tool({
    description: 'send a message in a channel',
    inputSchema: z.object({
      channelId: z.string().describe('id of channel'),
      content: z.string().min(1, 'message cannot be empty').max(2000).describe('message content'),
    }),
    execute: async ({ channelId, content }): Promise<ToolResult> => {
      try {
        const channel = await guild.channels.fetch(channelId);
        if (!channel) {
          return { summary: `Channel ${channelId} not found in guild ${guild.name}` };
        }
        if (!channel.isTextBased()) {
          return {
            summary: `Channel ${'name' in channel ? `#${channel.name}` : channelId} is not text-based`,
          };
        }
        const sent = await channel.send(content);
        return {
          summary: `Sent message to <#${channel.id}>`,
          data: { id: sent.id, url: sent.url, channelId: channel.id },
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to send message to ${channelId}: ${msg}` };
      }
    },
  });
}
