# Extensibility

## Custom Tools

Register your own tools next to the built-ins. Use `zod` for inputs and return `ToolResult`.

```ts
import { ToolRegistry, createTool, discordApiTools } from 'discord-ai-sdk';
import { tool } from 'ai';
import { z } from 'zod';

const toolRegistry = new ToolRegistry({
  tools: {
    ...discordApiTools,
    greetUser: createTool(
      (guild) =>
        tool({
          description: 'greet a user by name',
          inputSchema: z.object({ name: z.string().min(1) }),
          execute: async ({ name }) => ({ summary: `[${guild.name}] Hello ${name}!` }),
        }),
      'low',
    ),
  },
});
```

## PromptBuilder Rules

Replace or extend system rules responsibly.

```ts
import { PromptBuilder } from 'discord-ai-sdk';

const pb = new PromptBuilder();
pb.addRule('Prefer concise, bullet-style summaries.');
// override entire system prompt if you must
pb.override('You are a helpful assistant.');
```

## Per-guild Safety Caps and Gating

Provide per-guild safety caps and router gates.

```ts
import { ToolRegistry, DiscordRouter } from 'discord-ai-sdk';

const reg = new ToolRegistry();
reg.setSafetyModeCap(async (guild) => (guild.id === 'VIP' ? 'high' : 'mid'));

const router = new DiscordRouter({
  mode: 'slash',
  activator: 'assist',
  engine,
  requiredRoleFn: async (guild) => 'ROLE_ID',
  allowedChannelsFn: async (guild) => ['CHANNEL_ID'],
});
```

## Custom RateLimiter

Swap in a custom instance with dynamic limits.

```ts
import { RateLimiter } from 'discord-ai-sdk';

const rateLimiter = new RateLimiter({
  limitCount: 3,
  windowMs: 60_000,
  customRateLimits: async (userId, guild) => ({ limitCount: 5, windowMs: 30_000 }),
});
```

## Custom Logger

Provide your own `Logger` implementation.

```ts
import type { Logger } from 'discord-ai-sdk';

class MyLogger implements Logger {
  debug(msg: string, meta?: unknown) {}
  info(msg: string, meta?: unknown) {}
  warn(msg: string, meta?: unknown) {}
  error(msg: string | Error, meta?: unknown) {}
}
```
