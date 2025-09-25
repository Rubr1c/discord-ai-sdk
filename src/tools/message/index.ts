import { getMessagesTool } from './fetch';
import { sendMessageTool } from './send';
import { deleteMessageTool } from './delete';
import { pinMessageTool } from './pin';
import { unpinMessageTool } from './unpin';
import type { ToolFactory } from '@/tools/types';

export const messageTools = {
  getMessages: getMessagesTool,
  sendMessage: sendMessageTool,
  deleteMessage: deleteMessageTool,
  pinMessage: pinMessageTool,
  unpinMessage: unpinMessageTool,
} satisfies Record<string, ToolFactory>;
