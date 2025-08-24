import type { Guild } from 'discord.js';
import { createChannelTool } from './createChannel';
import { createRoleTool } from './createRole';
import { getCategoriesTools } from './getCategories';
import { createCategoriesTools } from './createCategory';
import { getRolesTools } from './getRoles';

export function tools(guild: Guild) {
  return {
    createChannel: createChannelTool(guild),
    createRole: createRoleTool(guild),
    createCategories: createCategoriesTools(guild),
    getCategories: getCategoriesTools(guild),
    getRoles: getRolesTools(guild),
  };
}
