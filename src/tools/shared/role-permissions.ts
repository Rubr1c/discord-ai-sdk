import { PermissionsBitField } from 'discord.js';
import z from 'zod';

/**
 * Zod schema for role permissions.
 */
export const PermissionSchema = z
  .object(
    Object.fromEntries(
      Object.keys(PermissionsBitField.Flags).map((flag) => [
        flag,
        z.boolean().optional(),
      ]),
    ),
  )
  .optional()
  .describe(
    'Role permissions - set Administrator to true for full access, or specify individual permissions like ViewChannel (to see channel), SendMessages (to send messages), etc.',
  );

/**
 * The type for role permissions.
 */
export type PermissionInput = z.infer<typeof PermissionSchema>;

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
