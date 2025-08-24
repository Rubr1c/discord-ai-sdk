import type { Guild } from 'discord.js';
import { createChannelTool } from './createChannel';
import { createRoleTool } from './createRole';
import { getCategoriesTools } from './getCategories';

export function tools(guild: Guild) {
  return {
    createChannel: createChannelTool(guild),
    createRole: createRoleTool(guild),
    getCategories: getCategoriesTools(guild),
  };
}
