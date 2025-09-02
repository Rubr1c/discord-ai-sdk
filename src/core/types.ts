import type { Tool } from 'ai';
import type {

  Guild,
  GuildMember,
  APIInteractionGuildMember,
  GuildBasedChannel,
} from 'discord.js';

export const ErrorReason = {
  RATE_LIMIT: 'Rate Limited',
  NO_PERMISSION: 'No Permission',
};

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

export type Safety = 'low' | 'mid' | 'high';

export interface AITool {
  tool: (guild: Guild) => Tool;
  safetyLevel: Safety;
}

export function createTool(tool: (guild: Guild) => Tool, safetyLevel: Safety) {
  return { tool, safetyLevel };
}

export interface ToolProvider {
  getTools(ctx: RequestContext): Record<string, AITool>;
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
