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
import { createTool } from '../core/types';

export const discordApiTools = {
  createRole: createTool((guild) => createRoleTool(guild), 'mid'),
  getRoles: createTool((guild) => getRolesTool(guild), 'low'),
  deleteRole: createTool((guild) => deleteRoleTool(guild), 'high'),
  assignRole: createTool((guild) => assignRoleTool(guild), 'high'),
  removeRole: createTool((guild) => removeRoleTool(guild), 'high'),
  getRoleId: createTool((guild) => getRoleIdTool(guild), 'low'),
  createCategory: createTool((guild) => createCategoryTool(guild), 'mid'),
  getCategories: createTool((guild) => getCategoriesTool(guild), 'low'),
  deleteCategory: createTool((guild) => deleteCategoryTool(guild), 'high'),
  createChannel: createTool((guild) => createChannelTool(guild), 'mid'),
  getChannels: createTool((guild) => getChannelsTool(guild), 'low'),
  deleteChannel: createTool((guild) => deleteChannelTool(guild), 'high'),
  renameChannel: createTool((guild) => renameChannelTool(guild), 'mid'),
  getMembers: createTool((guild) => getMembersTool(guild), 'low'),
  kickMember: createTool((guild) => kickMemberTool(guild), 'high'),
  banMember: createTool((guild) => banMemberTool(guild), 'high'),
  unbanMember: createTool((guild) => unbanMemberTool(guild), 'high'),
  getUserId: createTool((guild) => getUserIdTool(guild), 'low'),
  getServerInfo: createTool((guild) => getServerInfoTool(guild), 'low'),
  setServerName: createTool((guild) => setServerNameTool(guild), 'high'),
};

export function createTool(tool: (guild: Guild) => Tool, safetyLevel: Safety) {
  return { tool, safetyLevel };
}
