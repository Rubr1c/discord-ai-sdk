import { PermissionsBitField } from 'discord.js';
import z from 'zod';

/**
 * Zod schema for role permissions.
 */
export const permissionSchema = z
  .object(
    Object.fromEntries(
      Object.keys(PermissionsBitField.Flags).map((flag) => [flag, z.boolean().optional()]),
    ),
  )
  .optional()
  .describe(
    'Role permissions - set Administrator to true for full access, or specify individual permissions like ViewChannel (to see channel), SendMessages (to send messages), etc.',
  );

/**
 * Zod schema for permission overwrites.
 */
export const permissionOverwriteSchema = z
  .array(
    z
      .object({
        id: z.string().describe('Role or user ID'),
        allow: permissionSchema.describe('Permissions to allow'),
        deny: permissionSchema.describe('Permissions to deny'),
      })
      .refine((data) => data.allow || data.deny, {
        message: 'At least one of allow or deny must be present',
      }),
  )
  .optional()
  .describe(
    'Permission overwrites for specific roles/users. Example: [{id: "roleId", allow: {ViewChannel: true}, deny: {}}]',
  );

/**
 * The type for role permissions.
 */
export type PermissionInput = z.infer<typeof permissionSchema>;

/**
 * Converts a role permissions object to an array of flag values.
 * @param permissions - The role permissions object.
 * @returns The array of flag values.
 */
export function permissionsToFlags(permissions?: PermissionInput): bigint[] {
  if (!permissions) return [];

  const flags: bigint[] = [];

  for (const [key, value] of Object.entries(permissions)) {
    if (value) {
      const flag = PermissionsBitField.Flags[key as keyof typeof PermissionsBitField.Flags];
      if (flag !== undefined) {
        flags.push(flag);
      }
    }
  }

  return flags;
}
