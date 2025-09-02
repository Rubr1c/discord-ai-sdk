import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function removeRoleTool(guild: Guild): Tool {
  return tool({
    description: 'remove role from user',
    inputSchema: z.object({
      role_id: z.string().describe('id of role'),
      user_id: z.string().describe('id of user'),
    }),
    execute: async ({ role_id, user_id }) => {
      const user = await guild.members.fetch(user_id);
      await user.roles.remove(role_id);

      return `Removed role ${role_id} from ${user_id}`;
    },
  });
}