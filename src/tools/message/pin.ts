import { tool } from 'ai';
import z from 'zod';
import type { ToolFactory, ToolResult } from '@/tools/types';

/**
 * Creates a tool factory to pin a message.
 * @returns The tool factory.
 */
export const pinMessageTool: ToolFactory = {
  tool: ({ guild, logger }) =>
    tool({
      description: 'pin a message',
      inputSchema: z.object({
        channelId: z.string().describe('channel id'),
        messageId: z.string().describe('message id'),
      }),
      execute: async ({ messageId, channelId }): Promise<ToolResult> => {
        try {
          logger?.info({
            message: 'pinMessageTool called',
            meta: { channelId, messageId },
          });

          const channel = await guild.channels.fetch(channelId);

          if (!channel) {
            return { summary: `Channel ${channelId} not found` };
          }

          if (!channel.isTextBased()) {
            return { summary: `Channel ${channelId} is not a text channel` };
          }

          try {
            const message = await channel.messages.fetch(messageId);
            if (message.pinned) {
              return { summary: `Message ${messageId} is already pinned` };
            }

            await message.pin();

            logger?.info({
              message: 'pinMessageTool completed',
              meta: { channelId, messageId },
            });

            return { summary: `Pinned message ${messageId}` };
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logger?.error({
              message: 'pinMessageTool failed',
              meta: { channelId, messageId },
              error: err instanceof Error ? err : new Error(message),
            });
            return { summary: `Failed to pin message ${messageId}: ${(err as Error).message}` };
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          logger?.error({
            message: 'pinMessageTool failed',
            meta: { channelId, messageId },
            error: err instanceof Error ? err : new Error(message),
          });
          return { summary: `Failed to pin message ${messageId}: ${message}` };
        }
      },
    }),
  safetyLevel: 'mid',
};
