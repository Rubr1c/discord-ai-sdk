import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function getServerInfoTool(guild: Guild): Tool {
  return tool({
    description: 'get basic server info',
    inputSchema: z.object(),
    execute: async () => {
      const { name, createdAt, memberCount, ownerId } = guild;

      return `[OWNER: ${ownerId}] ${name} - ${memberCount} members [created: ${createdAt}]`;
    },
  });
}
