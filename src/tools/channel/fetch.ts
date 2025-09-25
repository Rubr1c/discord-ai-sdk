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
    description:
      'fetch existing channels (all types by default, or filter by specific channel type)',
    inputSchema: z.object({
      type: z.enum(['voice', 'text']).optional().describe('type of channel to fetch'),
    }),
    execute: async ({ type }): Promise<ToolResult> => {
      try {
        const channels = (await guild.channels.fetch()).filter((channel) =>
          type
            ? channel?.type === (type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText)
            : true,
        );

        const channelList = channels.map((channel) => ({
          id: channel?.id,
          name: channel?.name,
          type: channel?.type,
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
