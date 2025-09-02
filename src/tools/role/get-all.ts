import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';

export function getRolesTool(guild: Guild): Tool {
  return tool({
    description: 'fetch existing roles (name, color, id)',
    inputSchema: z.object(),
    execute: async () => {
      const roles = await guild.roles.fetch();

      const roleList = roles.map((role) => ({
        name: role.name,
        colors: role.colors,
        id: role.id,
      }));

      return `Found ${roleList.length} roles in this server:\n${roleList
        .map(
          (role) =>
            `- ${role.name} [${role.colors.primaryColor}] (ID: ${role.id})`
        )
        .join('\n')}`;
    },
  });
}
