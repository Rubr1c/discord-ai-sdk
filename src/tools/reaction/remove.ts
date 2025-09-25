import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to remove a reaction from a message.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function removeReactionTool(guild: Guild): Tool {
  return tool({
    description: 'remove a reaction from a message',
    inputSchema: z.object({
      channelId: z.string().describe('id of channel'),
      messageId: z.string().describe('id of message'),
      emoji: z.string().describe('emoji to remove (from fetching or default discord emojis)'),
    }),
    execute: async ({ channelId, messageId, emoji }): Promise<ToolResult> => {
      try {
        const channel = await guild.channels.fetch(channelId);

        if (!channel?.isTextBased()) {
          return { summary: `Channel ${channelId} is not a text channel` };
        }

        const message = await channel.messages.fetch(messageId);

        await message.reactions.cache.get(emoji)?.remove();

        return { summary: `Removed reaction ${emoji} from message ${messageId}` };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return {
          summary: `Failed to remove reaction ${emoji} from message ${messageId}: ${errorMessage}`,
        };
      }
    },
  });
}
