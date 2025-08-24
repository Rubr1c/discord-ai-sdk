import type { Guild } from 'discord.js';
import { createChannelTool } from './createChannel';
import { createRoleTool } from './createRole';

export function tools(guild: Guild) {
  return {
    createChannel: createChannelTool(guild),
    createRole: createRoleTool(guild),
  };
}
