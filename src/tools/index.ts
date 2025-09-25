import { createChannelTool } from '@/tools/channel/create';
import { createRoleTool } from '@/tools/role/create';
import { getCategoriesTool } from '@/tools/category/fetch';
import { createCategoryTool } from '@/tools/category/create';
import { getRolesTool } from '@/tools/role/fetch';
import { getChannelsTool } from '@/tools/channel/fetch';
import { deleteChannelTool } from '@/tools/channel/delete';
import { renameChannelTool } from '@/tools/channel/rename';
import { deleteCategoryTool } from '@/tools/category/delete';
import { deleteRoleTool } from '@/tools/role/delete';
import { assignRoleTool } from '@/tools/role/assign';
import { removeRoleTool } from '@/tools/role/remove';
import { updateRoleTool } from '@/tools/role/update';
import { getMembersTool } from '@/tools/member/fetch';
import { kickMemberTool } from '@/tools/member/kick';
import { banMemberTool } from '@/tools/member/ban';
import { unbanMemberTool } from '@/tools/member/unban';
import { getServerInfoTool } from '@/tools/server/info';
import { setServerNameTool } from '@/tools/server/rename';
import { getRoleIdTool } from '@/tools/role/id';
import { getUserIdTool } from '@/tools/member/id';
import type { Guild } from 'discord.js';
import type { Safety } from '@/core/types';
import type { Tool } from 'ai';
import { timeoutMemberTool } from '@/tools/member/timeout';
import { untimeoutMemberTool } from '@/tools/member/untimeout';
import { getEmojisTool } from '@/tools/server/emojis';
import { getStickersTool } from '@/tools/server/stickers';
import { moveChannelTool } from '@/tools/channel/move';
import { sendMessageTool } from '@/tools/message/send';
import { getMessagesTool } from '@/tools/message/get';
import { pinMessageTool } from '@/tools/message/pin';
import { unpinMessageTool } from '@/tools/message/unpin';
import { deleteMessageTool } from '@/tools/message/delete';
import { manageChannelPermissionsTool } from '@/tools/channel/permission';
import { getAuditLogsTool } from '@/tools/server/audit-logs';
import { deafenMemberTool } from './vc/deafen';
import { disconnectMemberTool } from './vc/disconnect';
import { moveMemberTool } from './vc/move';
import { muteMemberTool } from './vc/mute';

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
  moveMember: createTool(moveMemberTool, 'mid'),
  muteMember: createTool(muteMemberTool, 'mid'),
  deafenMember: createTool(deafenMemberTool, 'mid'),
  disconnectMember: createTool(disconnectMemberTool, 'mid'),
};
