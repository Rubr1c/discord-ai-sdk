import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to defean a member in the server.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function deafenMemberTool(guild: Guild): Tool {
  return tool({
    description: 'defean or undefean a member in the server',
    inputSchema: z.object({
      userId: z.string().describe('id of target user'),
      defean: z.boolean().describe('whether to defean the member'),
    }),
    execute: async ({ userId, defean }): Promise<ToolResult> => {
      try {
        const member = await guild.members.fetch(userId);
        await member.voice.setDeaf(defean);
        return { summary: `Defeaned member ${userId}` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to defean member ${userId}: ${message}` };
      }
    },
  });
}
