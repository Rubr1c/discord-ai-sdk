import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function pinMessageTool(guild: Guild): Tool {
  return tool({
    description: 'pin a message',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
      messageId: z.string().describe('message id'),
    }),
    execute: async ({ messageId, channelId }) => {
      const channel = await guild.channels.fetch(channelId);

      if (!channel?.isTextBased()) {
        return `Channel ${channelId} is not a text channel`;
      }

      const message = await channel.messages.fetch(messageId);

      await message.pin();

      return `Pinned Message: ${messageId}`;
    },
  });
}
