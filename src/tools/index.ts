import { createChannelTool } from './channel/create';
import { createRoleTool } from './role/create';
import { getCategoriesTool } from './category/get-all';
import { createCategoryTool } from './category/create';
import { getRolesTool } from './role/get-all';
import { getChannelsTool } from './channel/get-all';
import { deleteChannelTool } from './channel/delete';
import { renameChannelTool } from './channel/rename';
import { deleteCategoryTool } from './category/delete';
import { deleteRoleTool } from './role/delete';
import { assignRoleTool } from './role/assign';
import { removeRoleTool } from './role/remove';
import { getMembersTool } from './member/get-all';
import { kickMemberTool } from './member/kick';
import { banMemberTool } from './member/ban';
import { unbanMemberTool } from './member/unban';
import { getServerInfoTool } from './server/info';
import { setServerNameTool } from './server/set-name';
import { getRoleIdTool } from './role/get-id';
import { getUserIdTool } from './user/get-id';
import type { Guild } from 'discord.js';
import type { Safety } from '../core/types';
import type { Tool } from 'ai';
import { timeoutMemberTool } from './member/timeout';
import { untimeoutMemberTool } from './member/untimeout';
import { getEmojisTool } from './server/emojis';

export function createTool(tool: (guild: Guild) => Tool, safetyLevel: Safety) {
  return { tool, safetyLevel };
}

export const discordApiTools = {
  createRole: createTool(createRoleTool, 'mid'),
  getRoles: createTool(getRolesTool, 'low'),
  deleteRole: createTool(deleteRoleTool, 'high'),
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
};
