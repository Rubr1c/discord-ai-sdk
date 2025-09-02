import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function getUserIdTool(guild: Guild): Tool {
  return tool({
    description: 'fetch user id from username',
    inputSchema: z.object({
      username: z.string().describe('username of tagert'),
    }),
    execute: async ({ username }) => {
      const user = (await guild.members.fetch()).find(
        (mem) => mem.user.username === username
      );

      return `${username}: ${user?.id}`;
    },
  });
}
