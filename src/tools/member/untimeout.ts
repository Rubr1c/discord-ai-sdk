import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function untimeoutMemberTool(guild: Guild): Tool {
  return tool({
    description: 'remove timeout from a member in the server',
    inputSchema: z.object({
      user_id: z.string().describe('id of target user'),
    }),
    execute: async ({ user_id, }) => {
      const user = await guild.members.fetch(user_id);

      await user.timeout(null, "Timeout removed");
    
      return `Removed timeout from user ${user_id}`;
    },
  });
}
