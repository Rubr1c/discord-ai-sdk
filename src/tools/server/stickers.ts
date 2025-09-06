import { tool, type Tool } from 'ai';
import { type Guild, StickerFormatType } from 'discord.js';
import z from 'zod';

export function getStickersTool(guild: Guild): Tool {
  return tool({
    description: 'get server stickers',
    inputSchema: z.object(),
    execute: async () => {
      const fetched = await guild.stickers.fetch();
      const lines = Array.from(fetched.values()).map((s) => {
        const format = StickerFormatType[s.format];
        const flags = [
          s.available ? undefined : 'unavailable',
          format ? `format:${String(format).toLowerCase()}` : undefined,
        ].filter(Boolean);
        const flagsStr = flags.length ? ` (${flags.join(', ')})` : '';
        return `- ${s.name ?? 'unknown'} [${s.id}] ${s.url}${flagsStr}`;
      });

      return `Fetched stickers (${lines.length}):\n${lines.join('\n')}`;
    },
  });
}
