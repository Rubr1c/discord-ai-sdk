export { AIEngine } from './core/ai-engine';
export { DiscordRouter } from './core/discord-router';
export { PromptBuilder } from './core/prompt-builder';
export { RateLimiter } from './core/rate-limiter';
export { ToolRegistry } from './core/tool-registry';
export { ConsoleLogger } from './core/console-logger';
export type { ToolRegistryProps } from './core/tool-registry';
export { AIError, ErrorReason } from './core/error';

export type { AITool, RequestContext, Safety, BotMode, Logger } from './core/types';
export { SAFETY } from './core/types';

export type { DiscordRouterProps } from './core/discord-router';

export type { RateLimitOpts, RateLimitFn } from './core/rate-limiter';

export { discordApiTools, createTool } from './tools';
export type { ToolResult } from './tools/types';
