import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function unbanMemberTool(guild: Guild): Tool {
  return tool({
    description: 'unban a member from the server',
    inputSchema: z.object({
      user_id: z.string().describe('id of target user'),
      reason: z.string().nullable().describe('reason for unban'),
    }),
    execute: async ({ user_id, reason }) => {
      await guild.members.unban(user_id, reason || 'No Reason Provided');

      return `Unbanned user ${user_id}`;
    },
  });
}
