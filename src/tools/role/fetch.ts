import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function getRolesTool(guild: Guild): Tool {
  return tool({
    description: 'fetch existing roles (name, color, id)',
    inputSchema: z.object({}),
    execute: async (): Promise<ToolResult> => {
      try {
        const roles = await guild.roles.fetch();
        const roleList = roles.map((role) => ({
          name: role.name,
          color: role.color,
          id: role.id,
        }));
        return {
          summary: `Found ${roleList.length} roles in this server`,
          data: roleList,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to fetch roles: ${msg}` };
      }
    },
  });
}
