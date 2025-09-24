import { tool, type Tool } from 'ai';
import { type Guild, StickerFormatType } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';

/**
 * Creates a tool to fetch server stickers.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function getStickersTool(guild: Guild): Tool {
  return tool({
    description: 'get server stickers',
    inputSchema: z.object({}),
    execute: async (): Promise<ToolResult> => {
      try {
        const fetched = await guild.stickers.fetch();
        const list = Array.from(fetched.values()).map((s) => ({
          id: s.id,
          name: s.name,
          url: s.url,
          available: s.available,
          format: String(StickerFormatType[s.format]).toLowerCase(),
        }));

        return {
          summary: `Fetched stickers (${list.length})`,
          data: list,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to fetch stickers: ${message}` };
      }
    },
  });
}
