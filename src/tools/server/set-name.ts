import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function setServerNameTool(guild: Guild): Tool {
  return tool({
    description: 'set server name',
    inputSchema: z.object({
      name: z.string().describe('server name'),
    }),
    execute: async ({ name }) => {
      await guild.setName(name);

      return `Renamed server to ${name}`;
    },
  });
}
