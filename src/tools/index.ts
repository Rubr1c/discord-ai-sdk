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
import { timeoutMemberTool } from '@/tools/member/timeout';
import { untimeoutMemberTool } from '@/tools/member/untimeout';
import { getEmojisTool } from '@/tools/server/emojis';
import { getStickersTool } from '@/tools/server/stickers';
import { moveChannelTool } from '@/tools/channel/move';
import { sendMessageTool } from '@/tools/message/send';
import { getMessagesTool } from '@/tools/message/fetch';
import { pinMessageTool } from '@/tools/message/pin';
import { unpinMessageTool } from '@/tools/message/unpin';
import { deleteMessageTool } from '@/tools/message/delete';
import { manageChannelPermissionsTool } from '@/tools/channel/permission';
import { getAuditLogsTool } from '@/tools/server/audit-logs';
import { getBansTool } from '@/tools/server/bans';
import { createThreadTool } from '@/tools/thread/create';
import { getThreadsTool } from '@/tools/thread/fetch';
import { deleteThreadTool } from '@/tools/thread/delete';
import { archiveThreadTool } from '@/tools/thread/archive';
import { deafenMemberTool } from '@/tools/vc/deafen';
import { disconnectMemberTool } from '@/tools/vc/disconnect';
import { moveMemberTool } from '@/tools/vc/move';
import { muteMemberTool } from '@/tools/vc/mute';
import { getReactionsTool } from '@/tools/reaction/fetch';
import { addReactionTool } from '@/tools/reaction/add';
import { removeReactionTool } from '@/tools/reaction/remove';
import type { ToolFactory } from '@/tools/types';

/**
 * Creates a tool.
 * @param tool - The tool factory.
 * @param safetyLevel - The safety level.
 * @returns The tool.
 */
export function createTool(toolFactory: ToolFactory) {
  return { tool: toolFactory.tool, safetyLevel: toolFactory.safetyLevel };
}

/**
 * The Discord API tools.
 */
export const discordApiTools = {
  createRole: createRoleTool,
  getRoles: getRolesTool,
  deleteRole: deleteRoleTool,
  updateRole: updateRoleTool,
  assignRole: assignRoleTool,
  removeRole: removeRoleTool,
  getRoleId: getRoleIdTool,
  createCategory: createCategoryTool,
  getCategories: getCategoriesTool,
  deleteCategory: deleteCategoryTool,
  createChannel: createChannelTool,
  getChannels: getChannelsTool,
  deleteChannel: deleteChannelTool,
  renameChannel: renameChannelTool,
  moveChannel: moveChannelTool,
  manageChannelPermissions: manageChannelPermissionsTool,
  getMembers: getMembersTool,
  kickMember: kickMemberTool,
  banMember: banMemberTool,
  unbanMember: unbanMemberTool,
  timeoutMember: timeoutMemberTool,
  untimeoutMember: untimeoutMemberTool,
  getUserId: getUserIdTool,
  getServerInfo: getServerInfoTool,
  setServerName: setServerNameTool,
  getEmojis: getEmojisTool,
  getStickers: getStickersTool,
  sendMessage: sendMessageTool,
  deleteMessage: deleteMessageTool,
  getMessages: getMessagesTool,
  pinMessage: pinMessageTool,
  unpinMessage: unpinMessageTool,
  getAuditLogs: getAuditLogsTool,
  getBans: getBansTool,
  createThread: createThreadTool,
  deleteThread: deleteThreadTool,
  archiveThread: archiveThreadTool,
  getThreads: getThreadsTool,
  moveMember: moveMemberTool,
  muteMember: muteMemberTool,
  deafenMember: deafenMemberTool,
  disconnectMember: disconnectMemberTool,
  getReactions: getReactionsTool,
  addReaction: addReactionTool,
  removeReaction: removeReactionTool,
} satisfies Record<string, ToolFactory>;
