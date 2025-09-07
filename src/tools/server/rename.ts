import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function setServerNameTool(guild: Guild): Tool {
  return tool({
    description: 'set server name',
    inputSchema: z.object({
      name: z.string().describe('server name'),
    }),
    execute: async ({ name }): Promise<ToolResult> => {
      await guild.setName(name);

      return { summary: `Renamed server to ${name}` };
    },
  });
}
