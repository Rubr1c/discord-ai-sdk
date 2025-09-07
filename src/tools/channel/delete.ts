import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function deleteChannelTool(guild: Guild): Tool {
  return tool({
    description: 'delete a channel',
    inputSchema: z.object({
      id: z.string().describe('channel id'),
    }),
    execute: async ({ id }): Promise<ToolResult> => {
      try {
        const channel = await guild.channels.fetch(id).catch(() => null);
        if (!channel) {
          return { summary: `Channel ${id} not found or inaccessible.` };
        }
        await channel.delete('Deleted via tool');
        return { summary: `Deleted channel ${channel.name} (${id}).` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to delete channel ${id}: ${message}` };
      }
    },
  });
}
