// Core Classes
export { AIEngine } from './core/ai-engine';
export { DiscordRouter } from './core/discord-router';
export { PromptBuilder } from './core/prompt-builder';
export { RateLimiter } from './core/rate-limiter';
export { ToolRegistry } from './core/tool-registry';
export { AIError } from './core/error';

// Core Types & Interfaces
export type {
  AITool,
  AiConfig,
  BotConfig,
  HandlerProps,
  RequestContext,
  LLMResult,
  Safety,
  BotMode,
  ToolProvider,
} from './core/types';

export type { AIEngineProps } from './core/ai-engine';

export type { DiscordRouterProps } from './core/discord-router';

// Core Functions
export { createTool, ErrorReason } from './core/types';

// Built-in Discord Tools
export { discordApiTools, DiscordToolProvider } from './tools';
export type { BuiltInTools } from './tools';
