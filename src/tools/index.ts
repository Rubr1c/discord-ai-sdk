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

export function tools(guild: Guild) {
  return {
    createChannel: createChannelTool(guild),
    createRole: createRoleTool(guild),
    createCategory: createCategoryTool(guild),
    getCategories: getCategoriesTool(guild),
    deleteCategory: deleteCategoryTool(guild),
    getRoles: getRolesTool(guild),
    getChannels: getChannelsTool(guild),
    deleteChannel: deleteChannelTool(guild),
    renameChannel: renameChannelTool(guild),
  };
}
