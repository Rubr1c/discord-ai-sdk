import type { Guild } from 'discord.js';
import { createChannelTool } from './createChannel';
import { createRoleTool } from './createRole';
import { getCategoriesTool } from './getCategories';
import { createCategoryTool } from './createCategory';
import { getRolesTool } from './getRoles';
import { getChannelsTool } from './getChannels';
import { deleteChannelTool } from './deleteChannel';
import { renameChannelTool } from './renameChannel';
import { deleteCategoryTool } from './deleteCategory';
import { deleteRoleTool } from './deleteRole';
import { assignRoleTool } from './assignRole';
import { removeRoleTool } from './removeRole';
import { getMembersTool } from './getMembers';
import { kickMemberTool } from './kickMember';
import { banMemberTool } from './banMember';
import { unbanMemberTool } from './unbanMember';
import { getServerInfoTool } from './getServerInfo';
import { setServerNameTool } from './setServerName';
import { getRoleIdTool } from './getRoleId';
import { getUserIdTool } from './getUserId';

export function tools(guild: Guild) {
  return {
    createRole: createRoleTool(guild),
    getRoles: getRolesTool(guild),
    deleteRole: deleteRoleTool(guild),
    assignRole: assignRoleTool(guild),
    removeRole: removeRoleTool(guild),
    getRoleId: getRoleIdTool(guild),
    createCategory: createCategoryTool(guild),
    getCategories: getCategoriesTool(guild),
    deleteCategory: deleteCategoryTool(guild),
    createChannel: createChannelTool(guild),
    getChannels: getChannelsTool(guild),
    deleteChannel: deleteChannelTool(guild),
    renameChannel: renameChannelTool(guild),
    getMembers: getMembersTool(guild),
    kickMember: kickMemberTool(guild),
    banMember: banMemberTool(guild),
    unbanMember: unbanMemberTool(guild),
    getUserId: getUserIdTool(guild),
    getServerInfo: getServerInfoTool(guild),
    setServerName: setServerNameTool(guild),
  };
}
