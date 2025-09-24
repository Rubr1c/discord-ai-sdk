import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to fetch existing channels.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function getChannelsTool(guild: Guild): Tool {
  return tool({
    description: 'fetch existing channels',
    inputSchema: z.object({}),
    execute: async (): Promise<ToolResult> => {
      try {
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
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to fetch channels: ${message}` };
      }
    },
  });
}
