import type { Tool } from 'ai';
import type {
  Guild,
  GuildMember,
  APIInteractionGuildMember,
  GuildBasedChannel,
} from 'discord.js';

export interface RequestContext {
  guild: Guild;
  channel: GuildBasedChannel;
  userId: string;
  content: string;
  member: GuildMember | APIInteractionGuildMember | null;
}

export interface LLMResult {
  text: string;
  toolResults?: {
    toolName: string;
    result: any;
  }[];
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

// export interface BotConfig {
//   client: Client;
//   mode: BotMode;
//   activator: string;
//   requiredRole?: string;
//   ephemeralReplies?: boolean;
//   rateLimitCount?: number;
//   rateLimitWindowMs?: number;
//   allowedChannels?: string[];
//   logLevel?: 'debug' | 'info' | 'warn' | 'error';
//   auditLogging?: boolean | { channelId: string };
// }

// export interface AiConfig {
//   model: LanguageModel;
//   system?: string;
//   maxSteps?: number;
//   maxRetries?: number;
//   tools?: Record<string, AITool>;
//   temperature?: number;
//   maxTokens?: number;
//   safetyLevel?: Safety;
//   fallbackModel?: LanguageModel;
// }
