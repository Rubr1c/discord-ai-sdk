import type { LanguageModel, Tool } from 'ai';
import type { Client } from 'discord.js';

export type Safety = 'low' | 'mid' | 'high';

export type AiTool = {
  tool: Tool;
  safetyLevel: Safety;
};

export function createTool(tool: Tool, safetyLevel: Safety) {
  return { tool, safetyLevel };
}

export type BotConfig = {
  client: Client;
  mode: 'command-builder' | 'message-handler';
  activator: string;
  requiredRole?: string;
  ephemeralReplies?: boolean;
  rateLimitCount?: number;
  rateLimitWindowMs?: number;
  allowedChannels?: string[];
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  auditLogging?: boolean | { channelId: string };
};

export type AiConfig = {
  model: LanguageModel;
  system?: string;
  maxSteps?: number;
  maxRetries?: number;
  tools?: Record<string, AiTool>;
  temperature?: number;
  maxTokens?: number;
  safetyLevel?: Safety;
  fallbackModel?: LanguageModel;
};

export type HandlerProps = {
  botConfig: BotConfig;
  aiConfig: AiConfig;
};
