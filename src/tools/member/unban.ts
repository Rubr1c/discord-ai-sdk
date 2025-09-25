import { tool } from 'ai';
import z from 'zod';
import type { ToolFactory, ToolResult } from '@/tools/types';

/**
 * Creates a tool factory for unbanning a member.
 * @returns The tool factory.
 */
export const unbanMemberTool: ToolFactory = {
  tool: ({ guild, logger }) =>
    tool({
      description: 'unban a member from the server',
      inputSchema: z.object({
        userId: z.string().describe('id of target user'),
        reason: z.string().nullable().describe('reason for unban'),
      }),
      execute: async ({ userId, reason }): Promise<ToolResult> => {
        try {
          logger?.info({
            message: 'unbanMemberTool called',
            meta: { userId, reason },
          });

          await guild.members.unban(userId, reason || 'No Reason Provided');

          logger?.info({
            message: 'unbanMemberTool completed',
            meta: { userId, reason },
          });

          return { summary: `Unbanned user ${userId}` };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          logger?.error({
            message: 'unbanMemberTool failed',
            meta: { userId, reason },
            error: err instanceof Error ? err : new Error(message),
          });
          return { summary: `Failed to unban ${userId}: ${message}` };
        }
      },
    }),
  safetyLevel: 'high',
};
