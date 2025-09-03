// Core Classes
export { AIEngine } from './core/ai-engine';
export { DiscordRouter } from './core/discord-router';
export { PromptBuilder } from './core/prompt-builder';
export { RateLimiter } from './core/rate-limiter';
export { ToolRegistry } from './core/tool-registry';
export { AIError, ErrorReason } from './core/error';

// Core Types & Interfaces
export type {
  AITool,
  RequestContext,
  LLMResult,
  Safety,
  BotMode,
} from './core/types';

export type { AIEngineProps } from './core/ai-engine';

export type { DiscordRouterProps } from './core/discord-router';

// Built-in Discord Tools
export { discordApiTools, createTool } from './tools';
