import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to move a member to a different voice channel.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function moveMemberTool(guild: Guild): Tool {
  return tool({
    description: 'move a member to a different voice channel',
    inputSchema: z.object({
      memberId: z.string().describe('id of member'),
      channelId: z.string().describe('id of channel'),
    }),
    execute: async ({ memberId, channelId }): Promise<ToolResult> => {
      try {
        const member = await guild.members.fetch(memberId);
        await member.voice.setChannel(channelId);
        return { summary: `Moved member ${memberId} to ${channelId}` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to move member ${memberId} to ${channelId}: ${message}` };
      }
    },
  });
}
