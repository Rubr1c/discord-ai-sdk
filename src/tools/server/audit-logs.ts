import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '@/tools/types';
import { auditLogTypesSchema, auditLogTypesToFlags } from '@/tools/shared/audit-log-types';

export function getAuditLogsTool(guild: Guild): Tool {
  return tool({
    description: 'get audit logs for the server',
    inputSchema: z.object({
      types: auditLogTypesSchema,
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)
        .describe('how many audit logs to fetch (1-100)'),
      before: z.string().optional().describe('get audit logs before this audit log ID'),
      after: z.string().optional().describe('get audit logs after this audit log ID'),
    }),
    execute: async ({ types, limit, before, after }): Promise<ToolResult> => {
      try {
        const options: Parameters<typeof guild.fetchAuditLogs>[0] = {
          type: auditLogTypesToFlags(types),
          limit,
        };

        if (before) options.before = before;
        if (after) options.after = after;

        const auditLogs = await guild.fetchAuditLogs(options);

        const list = auditLogs.entries.map((entry) => ({
          id: entry.id,
          action: entry.action,
          actionType: entry.actionType,
          reason: entry.reason,
          executor: entry.executor
            ? {
                id: entry.executor.id,
                username: entry.executor.username,
                discriminator: entry.executor.discriminator,
              }
            : null,
          target: entry.target
            ? {
                id: 'id' in entry.target ? entry.target.id : undefined,
                type: 'type' in entry.target ? entry.target.type : undefined,
              }
            : null,
          changes: entry.changes,
          extra: entry.extra,
          createdTimestamp: entry.createdTimestamp,
        }));

        return {
          summary: `Fetched audit logs (${list.length})`,
          data: list,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to fetch audit logs: ${message}` };
      }
    },
  });
}
