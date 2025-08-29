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
import { createTool, type AiTool } from '../types';

export function tools(guild: Guild): Record<string, AiTool> {
  return {
    createRole: createTool(createRoleTool(guild), 'mid'),
    getRoles: createTool(getRolesTool(guild), 'low'),
    deleteRole: createTool(deleteRoleTool(guild), 'high'),
    assignRole: createTool(assignRoleTool(guild), 'high'),
    removeRole: createTool(removeRoleTool(guild), 'high'),
    getRoleId: createTool(getRoleIdTool(guild), 'low'),
    createCategory: createTool(createCategoryTool(guild), 'mid'),
    getCategories: createTool(getCategoriesTool(guild), 'low'),
    deleteCategory: createTool(deleteCategoryTool(guild), 'high'),
    createChannel: createTool(createChannelTool(guild), 'mid'),
    getChannels: createTool(getChannelsTool(guild), 'low'),
    deleteChannel: createTool(deleteChannelTool(guild), 'high'),
    renameChannel: createTool(renameChannelTool(guild), 'mid'),
    getMembers: createTool(getMembersTool(guild), 'low'),
    kickMember: createTool(kickMemberTool(guild), 'high'),
    banMember: createTool(banMemberTool(guild), 'high'),
    unbanMember: createTool(unbanMemberTool(guild), 'high'),
    getUserId: createTool(getUserIdTool(guild), 'low'),
    getServerInfo: createTool(getServerInfoTool(guild), 'low'),
    setServerName: createTool(setServerNameTool(guild), 'high'),
  };
}

export type BuiltInTools = keyof ReturnType<typeof tools>;
