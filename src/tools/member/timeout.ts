import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function timeoutMemberTool(guild: Guild): Tool {
  return tool({
    description: 'timeout a member in the server',
    inputSchema: z.object({
      user_id: z.string().describe('id of target user'),
      reason: z.string().nullable().describe('reason for timeout'),
      duration: z.number().describe('duration of timeout in ms'),
    }),
    execute: async ({ user_id, reason, duration }) => {
      const user = await guild.members.fetch(user_id);

      await user.timeout(duration, reason ?? '');

      return `Timed out user ${user_id} for ${duration}`;
    },
  });
}
