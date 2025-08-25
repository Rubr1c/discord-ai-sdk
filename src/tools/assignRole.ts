import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function assignRoleTool(guild: Guild): Tool {
  return tool({
    description: 'assing role to user',
    inputSchema: z.object({
      role_id: z.string().describe('id of role'),
      user_id: z.string().describe('id of user'),
    }),
    execute: async ({ role_id, user_id }) => {
      const user = await guild.members.fetch(user_id);
      await user.roles.add(role_id);

      return `Added role ${role_id} to ${user_id}`;
    },
  });
}
