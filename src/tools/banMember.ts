import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function banMemberTool(guild: Guild): Tool {
  return tool({
    description: 'ban a member from the server',
    inputSchema: z.object({
      user_id: z.string().describe('id of target user'),
      reason: z.string().nullable().describe('reason for ban'),
    }),
    execute: async ({ user_id, reason }) => {
      const user = await guild.members.fetch(user_id);

      await user.ban({ reason: reason || 'No Reason Provided' });

      return `Banned user ${user_id}`;
    },
  });
}
