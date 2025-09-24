import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to fetch server bans.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function getBansTool(guild: Guild): Tool {
  return tool({
    description: 'get bans for the server',
    inputSchema: z.object({}),
    execute: async (): Promise<ToolResult> => {
      const bans = await guild.bans.fetch();
      const bansList = bans.map((ban) => ({
        id: ban.user.id,
        username: ban.user.username,
        discriminator: ban.user.discriminator,
      }));

      return { summary: `Found ${bansList.length} bans in this server`, data: bansList };
    },
  });
}
