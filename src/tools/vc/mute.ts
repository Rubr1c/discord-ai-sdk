import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to mute a member in the server.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function muteMemberTool(guild: Guild): Tool {
  return tool({
    description: 'mute or unmute a member in the server',
    inputSchema: z.object({
      userId: z.string().describe('id of target user'),
      mute: z.boolean().describe('whether to mute the member'),
    }),
    execute: async ({ userId, mute }): Promise<ToolResult> => {
      try {
        const member = await guild.members.fetch(userId);
        await member.voice.setMute(mute);
        return { summary: `Muted member ${userId}` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to mute member ${userId}: ${message}` };
      }
    },
  });
}
