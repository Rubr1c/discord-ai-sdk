import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function getUserIdTool(guild: Guild): Tool {
  return tool({
    description: 'fetch user id from username',
    inputSchema: z.object({
      username: z.string().describe('username of tagert'),
    }),
    execute: async ({ username }): Promise<ToolResult> => {
      const user = (await guild.members.fetch()).find((mem) => mem.user.username === username);

      return { summary: `${username}: ${user?.id ?? 'not found'}`, data: { id: user?.id ?? null } };
    },
  });
}
