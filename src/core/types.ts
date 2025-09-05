import type { Tool } from 'ai';
import type { Guild, GuildMember, APIInteractionGuildMember, GuildBasedChannel } from 'discord.js';

export interface RequestContext {
  guild: Guild;
  channel: GuildBasedChannel;
  userId: string;
  content: string;
  member: GuildMember | APIInteractionGuildMember | null;
}

export const SAFETY = {
  low: 0,
  mid: 1,
  high: 2,
} as const;

export type Safety = keyof typeof SAFETY;

export interface AITool {
  tool: (guild: Guild) => Tool;
  safetyLevel: Safety;
}

export type BotMode = 'slash' | 'message';
