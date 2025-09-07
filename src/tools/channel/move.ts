import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function moveChannelTool(guild: Guild): Tool {
  return tool({
    description: 'move channel (reorder / move into category)',
    inputSchema: z.object({
      channelId: z.string().describe('channel id'),
      position: z.number().int().describe('position in catagory'),
      categoryId: z
        .string()
        .nullable()
        .describe(
          'Category ID where the channel should be created. Use the ID from getCategories tool output.',
        ),
    }),
    execute: async ({ channelId, position, categoryId }): Promise<ToolResult> => {
      const channel = await guild.channels.fetch(channelId);
      if (!channel) {
        return { summary: `Channel ${channelId} not found` };
      }
      try {
        const updated = await channel.edit({ parent: categoryId ?? null, position });
        const parentLabel = updated.parent?.name ?? 'no category';
        return {
          summary: `Moved ${updated.name} to ${parentLabel} at position ${position}`,
          data: { id: updated.id, name: updated.name, categoryId: updated.parent?.id ?? null },
        };
      } catch (error) {
        return { summary: `Failed to move channel ${channelId}: ${(error as Error).message}` };
      }
    },
  });
}
