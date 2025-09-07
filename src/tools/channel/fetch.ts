import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function getChannelsTool(guild: Guild): Tool {
  return tool({
    description: 'fetch existing channels',
    inputSchema: z.object(),
    execute: async (): Promise<ToolResult> => {
      const channels = (await guild.channels.fetch()).filter(
        (channel) => channel?.type == ChannelType.GuildText,
      );  

      const channelList = channels.map((channel) => ({
        id: channel?.id,
        name: channel?.name,
        position: channel?.position,
        parent: channel?.parent?.id ?? null,
      }));

      return {
        summary: `Found ${channelList.length} channels in this server`,
        data: channelList,
      };
    },
  });
}
