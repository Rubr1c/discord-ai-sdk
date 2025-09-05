import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';

export function getChannelsTool(guild: Guild): Tool {
  return tool({
    description: 'fetch existing channels',
    inputSchema: z.object(),
    execute: async () => {
      const channels = (await guild.channels.fetch()).filter(
        (channel) => channel?.type == ChannelType.GuildText,
      );

      const channelList = channels.map((channel) => ({
        id: channel?.id,
        name: channel?.name,
        position: channel?.position,
        parent: channel?.parent,
      }));

      return `Found ${channelList.length} channels in this server:\n${channelList
        .map(
          (chan) =>
            `- [parent:${chan.parent} - POS #${chan.position}]${chan.name} (ID: ${chan.id})`,
        )
        .join('\n')}`;
    },
  });
}
