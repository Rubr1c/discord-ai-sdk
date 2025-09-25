import { tool } from 'ai';
import z from 'zod';
import type { ToolFactory, ToolResult } from '@/tools/types';

/**
 * Creates a tool factory to unpin a message.
 * @returns The tool factory.
 */
export const unpinMessageTool: ToolFactory = {
  tool: ({ guild, logger }) =>
    tool({
      description: 'unpin a message',
      inputSchema: z.object({
        channelId: z.string().describe('channel id'),
        messageId: z.string().describe('message id'),
      }),
      execute: async ({ messageId, channelId }): Promise<ToolResult> => {
        try {
          logger?.info({
            message: 'unpinMessageTool called',
            meta: { channelId, messageId },
          });

          const channel = await guild.channels.fetch(channelId);
          if (!channel) {
            return { summary: `Channel ${channelId} not found` };
          }
          if (!channel.isTextBased()) {
            return { summary: `Channel ${channelId} is not a text channel` };
          }

          const message = await channel.messages.fetch(messageId);
          await message.unpin('Unpinned via tool');

          logger?.info({
            message: 'unpinMessageTool completed',
            meta: { channelId, messageId },
          });

          return { summary: `Unpinned message ${messageId}` };
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          logger?.error({
            message: 'unpinMessageTool failed',
            meta: { channelId, messageId },
            error: err instanceof Error ? err : new Error(msg),
          });
          return { summary: `Failed to unpin message ${messageId}: ${msg}` };
        }
      },
    }),
  safetyLevel: 'mid',
};
