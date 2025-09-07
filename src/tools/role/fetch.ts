import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function getRolesTool(guild: Guild): Tool {
  return tool({
    description: 'fetch existing roles (name, color, id)',
    inputSchema: z.object(),
    execute: async (): Promise<ToolResult> => {
      const roles = await guild.roles.fetch();

      const roleList = roles.map((role) => ({
        name: role.name,
        colors: role.colors,
        id: role.id,
      }));

      return {
        summary: `Found ${roleList.length} roles in this server`,
        data: roleList,
      };
    },
  });
}
