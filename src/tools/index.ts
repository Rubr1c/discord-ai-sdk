import type { Guild } from 'discord.js';
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
import {
  createTool,
  type AITool,
  type ToolProvider,
  type RequestContext,
} from '../core/types';

export function discordApiTools(guild: Guild): Record<string, AITool> {
  return {
    createRole: createTool(() => createRoleTool(guild), 'mid'),
    getRoles: createTool(() => getRolesTool(guild), 'low'),
    deleteRole: createTool(() => deleteRoleTool(guild), 'high'),
    assignRole: createTool(() => assignRoleTool(guild), 'high'),
    removeRole: createTool(() => removeRoleTool(guild), 'high'),
    getRoleId: createTool(() => getRoleIdTool(guild), 'low'),
    createCategory: createTool(() => createCategoryTool(guild), 'mid'),
    getCategories: createTool(() => getCategoriesTool(guild), 'low'),
    deleteCategory: createTool(() => deleteCategoryTool(guild), 'high'),
    createChannel: createTool(() => createChannelTool(guild), 'mid'),
    getChannels: createTool(() => getChannelsTool(guild), 'low'),
    deleteChannel: createTool(() => deleteChannelTool(guild), 'high'),
    renameChannel: createTool(() => renameChannelTool(guild), 'mid'),
    getMembers: createTool(() => getMembersTool(guild), 'low'),
    kickMember: createTool(() => kickMemberTool(guild), 'high'),
    banMember: createTool(() => banMemberTool(guild), 'high'),
    unbanMember: createTool(() => unbanMemberTool(guild), 'high'),
    getUserId: createTool(() => getUserIdTool(guild), 'low'),
    getServerInfo: createTool(() => getServerInfoTool(guild), 'low'),
    setServerName: createTool(() => setServerNameTool(guild), 'high'),
  };
}

export class DiscordToolProvider implements ToolProvider {
  getTools(ctx: RequestContext): Record<string, AITool> {
    return discordApiTools(ctx.guild);
  }
}

export type BuiltInTools = keyof ReturnType<typeof discordApiTools>;
