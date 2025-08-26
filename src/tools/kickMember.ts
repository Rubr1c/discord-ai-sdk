import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function kickMemberTool(guild: Guild): Tool {
  return tool({
    description: 'kick a member from the server',
    inputSchema: z.object({
      user_id: z.string().describe('id of target user'),
      reason: z.string().nullable().describe('reason for kick'),
    }),
    execute: async ({ user_id, reason }) => {
      const user = await guild.members.fetch(user_id);

      await user.kick(reason || 'No Reason Provided');

      return `Kicked user ${user_id}`;
    },
  });
}
