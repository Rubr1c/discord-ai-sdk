import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function deleteMessageTool(guild: Guild): Tool {
  return tool({
    description: 'delete a message in a channel',
    inputSchema: z.object({
      channelId: z.string().describe('id of channel'),
      messageId: z.string().describe('id of message'),
    }),
    execute: async ({ channelId, messageId }) => {
      const channel = await guild.channels.fetch(channelId);

      if (!channel?.isTextBased()) {
        return `Channel ${channelId} is not a text channel`;
      }

      const msg = await channel.messages.fetch(messageId);

      await msg.delete();

      return `Deleted message ${messageId}`;
    },
  });
}
