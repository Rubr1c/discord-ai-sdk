import { tool } from 'ai';
import z from 'zod';
import type { ToolFactory, ToolResult } from '@/tools/types';

/**
 * Creates a tool factory for removing timeout from a member.
 * @returns The tool factory.
 */
export const untimeoutMemberTool: ToolFactory = {
  tool: ({ guild, logger }) =>
    tool({
      description: 'remove timeout from a member in the server',
      inputSchema: z.object({
        userId: z.string().describe('id of target user'),
      }),
      execute: async ({ userId }): Promise<ToolResult> => {
        try {
          logger?.info({
            message: 'untimeoutMemberTool called',
            meta: { userId },
          });

          const user = await guild.members.fetch(userId);

          await user.disableCommunicationUntil(null, 'Timeout removed');

          logger?.info({
            message: 'untimeoutMemberTool completed',
            meta: { userId },
          });

          return { summary: `Removed timeout from user ${userId}` };
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          logger?.error({
            message: 'untimeoutMemberTool failed',
            meta: { userId },
            error: err instanceof Error ? err : new Error(message),
          });
          return { summary: `Failed to remove timeout from user ${userId}: ${message}` };
        }
      },
    }),
  safetyLevel: 'high',
};
