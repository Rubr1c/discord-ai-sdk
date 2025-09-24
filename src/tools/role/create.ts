import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';
import { permissionSchema, permissionsToFlags } from '@/tools/shared/role-permissions';

/**
 * Creates a tool to create a role.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function createRoleTool(guild: Guild): Tool {
  return tool({
    description:
      'Create a new Discord role with customizable name, color, and permissions (including admin roles)',
    inputSchema: z.object({
      name: z.string().describe('name of role'),
      color: z
        .string()
        .regex(/^[0-9A-Fa-f]{6}$/)
        .nullable()
        .default('5865F2')
        .describe('role color in hex format like ff0000 for red (defaults to Discord blue)'),
      mentionable: z
        .boolean()
        .default(true)
        .describe('should the role be mentionable (defualt true)'),
      permissions: permissionSchema,
    }),
    execute: async ({ name, color, mentionable, permissions }): Promise<ToolResult> => {
      try {
        const roleColor = color ? parseInt(color, 16) : parseInt('5865F2', 16);

        const rolePermissions: bigint[] = permissionsToFlags(permissions ?? undefined);

        const role = await guild.roles.create({
          name,
          color: roleColor,
          mentionable,
          permissions: rolePermissions,
        });

        const permCount = permissions?.administrator
          ? 'Administrator (all permissions)'
          : `${rolePermissions.length} permissions`;

        return { summary: `Created role: ${role.name} with ${permCount}`, data: { id: role.id } };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to create role: ${message}` };
      }
    },
  });
}
