import type { ToolFactory } from '@/tools/types';
import { createChannelTool } from './create';
import { getChannelsTool } from './fetch';
import { deleteChannelTool } from './delete';
import { renameChannelTool } from './rename';
import { moveChannelTool } from './move';

export const channelTools = {
  createChannel: createChannelTool,
  getChannels: getChannelsTool,
  deleteChannel: deleteChannelTool,
  renameChannel: renameChannelTool,
  moveChannel: moveChannelTool,
} satisfies Record<string, ToolFactory>;
