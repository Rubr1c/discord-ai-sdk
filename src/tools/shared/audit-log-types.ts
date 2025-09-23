import { AuditLogEvent } from 'discord.js';
import z from 'zod';

/**
 * Zod schema for audit log types.
 */
export const auditLogTypesSchema = z
  .object(
    Object.fromEntries(
      Object.values(AuditLogEvent).map((value) => [value, z.boolean().optional()]),
    ),
  )
  .optional()
  .refine(
    (data) => {
      if (!data) return true;
      const enabledCount = Object.values(data).filter(Boolean).length;
      return enabledCount <= 1;
    },
    {
      message: 'Only one audit log type can be selected at a time',
    },
  )
  .describe('Audit log type to fetch (only one can be selected at a time)');

/**
 * The type for audit log types.
 */
export type AuditLogTypes = z.infer<typeof auditLogTypesSchema>;

/**
 * Converts audit log types to a single audit log event.
 * @param types - The audit log types.
 * @returns The first enabled audit log event, or null if none.
 */
export function auditLogTypesToFlags(types: AuditLogTypes): AuditLogEvent | null {
  if (!types) return null;

  for (const [type, value] of Object.entries(types)) {
    if (value) {
      const event = AuditLogEvent[type as keyof typeof AuditLogEvent];
      if (event !== undefined) {
        return event;
      }
    }
  }

  return null;
}
