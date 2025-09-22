import { tool, type Tool } from 'ai';
import { ChannelType, type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';
import { permissionOverwriteSchema, permissionsToFlags } from '../shared/role-permissions';

/**
 * Creates a tool to create a channel.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function createChannelTool(guild: Guild): Tool {
  return tool({
    description:
      'Create a Discord text channel, optionally in a specific category. Use getCategories first if you need to find a category by name. Use getRoleId first if you need to set permissions for a specific role.',
    inputSchema: z.object({
      channelName: z
        .string()
        .min(1, 'Channel name cannot be empty')
        .max(100, 'Channel name too long')
        .describe('Channel name (lowercase, no spaces, use dashes between words)'),
      category: z
        .string()
        .nullable()
        .optional()
        .describe(
          'Category ID where the channel should be created. Use the ID from getCategories tool output.',
        ),
      permissionOverwrites: permissionOverwriteSchema,
    }),
    execute: async ({ channelName, category, permissionOverwrites }): Promise<ToolResult> => {
      try {
        const cleanName = channelName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\-_]/g, '')
          .replace(/^-+|-+$/g, '');

        if (!cleanName) {
          return { summary: 'Channel name is invalid after cleaning' };
        }

        if (category) {
          const categoryChannel = await guild.channels.fetch(category).catch(() => null);
          if (!categoryChannel || categoryChannel.type !== ChannelType.GuildCategory) {
            return { summary: `Category with ID ${category} not found or is not a category` };
          }
        }

        const overwrites = permissionOverwrites?.map((o) => {
          if (!o.id) {
            throw new Error('Role or user ID is required for permission overwrites');
          }
          return {
            id: o.id,
            allow: permissionsToFlags(o.allow),
            deny: permissionsToFlags(o.deny),
          };
        });

        const channel = await guild.channels.create({
          name: cleanName,
          type: ChannelType.GuildText,
          parent: category || null,
          permissionOverwrites: overwrites ?? [],
        });

        return {
          summary: `Successfully created channel: #${channel.name} (ID: ${channel.id})${category ? ` in category ${category}` : ''}`,
          data: { id: channel.id, name: channel.name, categoryId: category ?? null },
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return { summary: `Failed to create channel: ${errorMsg}` };
      }
    },
  });
}
