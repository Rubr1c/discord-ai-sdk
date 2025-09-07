import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function sendMessageTool(guild: Guild): Tool {
  return tool({
    description: 'send a message in a channel',
    inputSchema: z.object({
      channelId: z.string().describe('id of channel'),
      content: z.string().max(2000).describe('message content'),
    }),
    execute: async ({ channelId, content }) => {
      const channel = await guild.channels.fetch(channelId);

      if (!channel?.isTextBased()) {
        return `Channel ${channelId} is not a text channel`;
      }
      
      await channel.send(content);

      return `Sent message to ${channelId}`;
    },
  });
}
