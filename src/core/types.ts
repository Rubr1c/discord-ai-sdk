import type { Tool } from 'ai';
import type { Guild, GuildMember, APIInteractionGuildMember, GuildBasedChannel } from 'discord.js';

/**
 * Request context.
 */
export interface RequestContext {
  guild: Guild;
  channel: GuildBasedChannel;
  userId: string;
  content: string;
  member: GuildMember | APIInteractionGuildMember | null;
}

/**
 * Safety levels.
 */
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

export interface LoggerParams {
  message: string;
  guild?: Guild;
  meta?: unknown;
  error?: Error;
}

export interface Logger {
  level: LogLevel;

  shouldLog(level: LogLevel): boolean;

  debug(params: LoggerParams): void;
  info(params: LoggerParams): void;
  warn(params: LoggerParams): void;
  error(params: LoggerParams): void;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const LOG_LEVEL_ORDER = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
} as const;
