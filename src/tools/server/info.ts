import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to fetch server info.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function getServerInfoTool(guild: Guild): Tool {
  return tool({
    description: 'get basic server info',
    inputSchema: z.object({}),
    execute: async (): Promise<ToolResult> => {
      const { name, createdAt, memberCount, ownerId } = guild;

      return {
        summary: `[OWNER: ${ownerId}] ${name} - ${memberCount} members [created: ${createdAt}]`,
      };
    },
  });
}
