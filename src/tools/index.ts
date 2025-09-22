import { createChannelTool } from './channel/create';
import { createRoleTool } from './role/create';
import { getCategoriesTool } from './category/fetch';
import { createCategoryTool } from './category/create';
import { getRolesTool } from './role/fetch';
import { getChannelsTool } from './channel/fetch';
import { deleteChannelTool } from './channel/delete';
import { renameChannelTool } from './channel/rename';
import { deleteCategoryTool } from './category/delete';
import { deleteRoleTool } from './role/delete';
import { assignRoleTool } from './role/assign';
import { removeRoleTool } from './role/remove';
import { updateRoleTool } from './role/update';
import { getMembersTool } from './member/fetch';
import { kickMemberTool } from './member/kick';
import { banMemberTool } from './member/ban';
import { unbanMemberTool } from './member/unban';
import { getServerInfoTool } from './server/info';
import { setServerNameTool } from './server/rename';
import { getRoleIdTool } from './role/id';
import { getUserIdTool } from './member/id';
import type { Guild } from 'discord.js';
import type { Safety } from '../core/types';
import type { Tool } from 'ai';
import { timeoutMemberTool } from './member/timeout';
import { untimeoutMemberTool } from './member/untimeout';
import { getEmojisTool } from './server/emojis';
import { getStickersTool } from './server/stickers';
import { moveChannelTool } from './channel/move';
import { sendMessageTool } from './message/send';
import { getMessagesTool } from './message/get';
import { pinMessageTool } from './message/pin';
import { unpinMessageTool } from './message/unpin';
import { deleteMessageTool } from './message/delete';
import { manageChannelPermissionsTool } from './channel/permission';
import { getAuditLogsTool } from './server/audit-logs';

/**
 * Creates a tool.
 * @param tool - The tool.
 * @param safetyLevel - The safety level.
 * @returns The tool.
 */
export function createTool(tool: (guild: Guild) => Tool, safetyLevel: Safety) {
  return { tool, safetyLevel };
}

/**
 * The Discord API tools.
 */
export const discordApiTools = {
  createRole: createTool(createRoleTool, 'mid'),
  getRoles: createTool(getRolesTool, 'low'),
  deleteRole: createTool(deleteRoleTool, 'high'),
  updateRole: createTool(updateRoleTool, 'high'),
  assignRole: createTool(assignRoleTool, 'high'),
  removeRole: createTool(removeRoleTool, 'high'),
  getRoleId: createTool(getRoleIdTool, 'low'),
  createCategory: createTool(createCategoryTool, 'mid'),
  getCategories: createTool(getCategoriesTool, 'low'),
  deleteCategory: createTool(deleteCategoryTool, 'high'),
  createChannel: createTool(createChannelTool, 'mid'),
  getChannels: createTool(getChannelsTool, 'low'),
  deleteChannel: createTool(deleteChannelTool, 'high'),
  renameChannel: createTool(renameChannelTool, 'mid'),
  moveChannel: createTool(moveChannelTool, 'mid'),
  manageChannelPermissions: createTool(manageChannelPermissionsTool, 'high'),
  getMembers: createTool(getMembersTool, 'low'),
  kickMember: createTool(kickMemberTool, 'high'),
  banMember: createTool(banMemberTool, 'high'),
  unbanMember: createTool(unbanMemberTool, 'high'),
  timeoutMember: createTool(timeoutMemberTool, 'mid'),
  untimeoutMember: createTool(untimeoutMemberTool, 'mid'),
  getUserId: createTool(getUserIdTool, 'low'),
  getServerInfo: createTool(getServerInfoTool, 'low'),
  setServerName: createTool(setServerNameTool, 'high'),
  getEmojis: createTool(getEmojisTool, 'low'),
  getStickers: createTool(getStickersTool, 'low'),
  sendMessage: createTool(sendMessageTool, 'low'),
  deleteMessage: createTool(deleteMessageTool, 'mid'),
  getMessages: createTool(getMessagesTool, 'low'),
  pinMessage: createTool(pinMessageTool, 'low'),
  unpinMessage: createTool(unpinMessageTool, 'mid'),
  getAuditLogs: createTool(getAuditLogsTool, 'low'),
};
