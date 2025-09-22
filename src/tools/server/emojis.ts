import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to fetch server emojis.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function getEmojisTool(guild: Guild): Tool {
  return tool({
    description: 'get server emojis',
    inputSchema: z.object({}),
    execute: async (): Promise<ToolResult> => {
      const fetched = await guild.emojis.fetch();
      const list = Array.from(fetched.values()).map((e) => ({
        id: e.id,
        name: e.name,
        url: e.imageURL(),
        animated: e.animated,
        available: e.available,
        managed: e.managed,
        requiresColons: e.requiresColons,
      }));

      return {
        summary: `Fetched emojis (${list.length})`,
        data: list,
      };
    },
  });
}
