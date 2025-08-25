import type { Guild } from 'discord.js';
import { createChannelTool } from './createChannel';
import { createRoleTool } from './createRole';
import { getCategoriesTools } from './getCategories';
import { createCategoriesTools } from './createCategory';
import { getRolesTools } from './getRoles';
import { getChannelsTools } from './getChannels';
import { deleteChannelTools } from './deleteChannel';
import { renameChannelTools } from './renameChannel';

export function tools(guild: Guild) {
  return {
    createChannel: createChannelTool(guild),
    createRole: createRoleTool(guild),
    createCategories: createCategoriesTools(guild),
    getCategories: getCategoriesTools(guild),
    getRoles: getRolesTools(guild),
    getChannels: getChannelsTools(guild),
    deleteChannel: deleteChannelTools(guild),
    renameChannel: renameChannelTools(guild),
  };
}
