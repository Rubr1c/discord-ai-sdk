import type { Guild } from 'discord.js';
import { createChannelTool } from './createChannel';

export function tools(guild: Guild) {
  return {
    createChannel: createChannelTool(guild),
  };
}
