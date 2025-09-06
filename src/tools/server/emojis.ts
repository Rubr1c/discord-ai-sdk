import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function getEmojisTool(guild: Guild): Tool {
  return tool({
    description: 'get server emojis',
    inputSchema: z.object(),
    execute: async () => {
      const fetched = await guild.emojis.fetch();
      const lines = Array.from(fetched.values()).map((e) => {
        const flags = [
          e.animated ? 'animated' : undefined,
          e.available ? undefined : 'unavailable',
          e.managed ? 'managed' : undefined,
          e.requiresColons ? 'requires-colons' : undefined,
        ].filter(Boolean);
        const flagsStr = flags.length ? ` (${flags.join(', ')})` : '';
        return `- ${e.name ?? 'unknown'} [${e.id}] ${e.imageURL()}${flagsStr}`;
      });

      return `Fetched emojis (${lines.length}):\n${lines.join('\n')}`;
    },
  });
}
