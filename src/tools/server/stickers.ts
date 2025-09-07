import { tool, type Tool } from 'ai';
import { type Guild, StickerFormatType } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function getStickersTool(guild: Guild): Tool {
  return tool({
    description: 'get server stickers',
    inputSchema: z.object(),
    execute: async (): Promise<ToolResult> => {
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
    },
  });
}
