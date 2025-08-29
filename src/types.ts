import type { LanguageModel, Tool } from 'ai';
import type { Client } from 'discord.js';

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

export type AIConfig = {
  model: LanguageModel;
  system?: string;
  maxSteps?: number;
  maxRetries?: number;
  tools?: Record<string, Tool>;
  temperature?: number;
  maxTokens?: number;
  safetyMode?: boolean;
  fallbackModel?: LanguageModel;
};

export type HandlerProps = {
  botConfig: BotConfig;
  aiConfig: AIConfig;
};
