import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';

export function deleteChannelTool(guild: Guild): Tool {
  return tool({
    description: 'delete a channel',
    inputSchema: z.object({
      id: z.string().describe('channel id'),
    }),
    execute: async ({ id }) => {
      const channel = await guild.channels.fetch(id);
      await channel?.delete();

      return `Deleted channel ${id}`;
    },
  });
}
