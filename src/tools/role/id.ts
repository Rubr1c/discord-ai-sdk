import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function getRoleIdTool(guild: Guild): Tool {
  return tool({
    description: 'fetch role id from role name',
    inputSchema: z.object({
      name: z.string().describe('name of target role'),
    }),
    execute: async ({ name }): Promise<ToolResult> => {
      const role = (await guild.roles.fetch()).find((role) => role.name === name);

      return { summary: `${name}: ${role?.id ?? 'not found'}`, data: { id: role?.id ?? null } };
    },
  });
}
