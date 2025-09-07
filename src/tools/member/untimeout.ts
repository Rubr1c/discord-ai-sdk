import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function untimeoutMemberTool(guild: Guild): Tool {
  return tool({
    description: 'remove timeout from a member in the server',
    inputSchema: z.object({
      userId: z.string().describe('id of target user'),
    }),
    execute: async ({ userId }): Promise<ToolResult> => {
      const user = await guild.members.fetch(userId);

      await user.timeout(null, 'Timeout removed');

      return { summary: `Removed timeout from user ${userId}` };
    },
  });
}
