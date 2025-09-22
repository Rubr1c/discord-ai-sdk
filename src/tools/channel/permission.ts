import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';
import { permissionOverwriteSchema, permissionsToFlags } from '../shared/role-permissions';

/**
 * Creates a tool to manage channel permissions.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function manageChannelPermissionsTool(guild: Guild): Tool {
  return tool({
    description: 'manage channel permissions',
    inputSchema: z.object({
      channelId: z.string().describe('id of channel'),
      permissionOverwrites: permissionOverwriteSchema,
    }),
    execute: async ({ channelId, permissionOverwrites }): Promise<ToolResult> => {
      const channel = await guild.channels.fetch(channelId);
      if (!channel || !('permissionOverwrites' in channel)) {
        return { summary: `Channel ${channelId} does not support permission overwrites` };
      }
      const overwrites = permissionOverwrites?.map((o) => ({
        id: o.id,
        allow: permissionsToFlags(o.allow),
        deny: permissionsToFlags(o.deny),
      }));
      await channel.permissionOverwrites.set(overwrites ?? []);
      return { summary: `Updated permissions for channel ${channelId}` };
    },
  });
}
