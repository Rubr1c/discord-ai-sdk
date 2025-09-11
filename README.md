# Discord AI SDK

TypeScript SDK that acts as an AI middleware between Discord.js and the Vercel AI SDK.

> You provide prompts; it calls the model, orchestrates Discord tools (channels, roles, messages, members, server), enforces limits/permissions, and returns clean responses. Stateless and extensible per guild.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quickstart](#quickstart)
- [Configuration](#configuration)
- [Usage](#usage)
- [Core Concepts](#core-concepts)
- [Examples](#examples)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Security](#security)
- [Rate Limiting](#rate-limiting)
- [Logging](#logging)
- [Testing](#testing)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [Security Policy](#security-policy)
- [License](#license)

---

## Features

- AI engine: wraps model calls, step limits, retries, temperature/tokens, and post-processing
- Prompt builder: base system prompt + user rules; encourages multi-step tool usage
- Tool registry: register built-in/custom tools; per-guild safety cap (low/mid/high)
- Discord router: message/slash modes, role/permission checks, channel gating, ephemeral replies, long-message splitting
- Rate limiting: per-user in-memory limiter with custom provider, reset helpers, logging
- Logging: pluggable Logger with configurable log level
- Standardized tool outputs: `{ summary: string, data?: unknown }`
- Built-in tools: channels, categories, roles, members, messages, server info/rename, emojis/stickers
- Extensibility: add your own tools, override prompts/rules, set per-guild safety/permissions

---

## Installation

```bash
# with pnpm
pnpm add discord-ai-sdk

# peer deps
pnpm add ai discord.js
```

> Requirements: Node.js 18.17+ or 20+

---

## Quickstart

Minimal example showing the primary entry point.

```ts
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { AIEngine, DiscordRouter, PromptBuilder } from 'discord-ai-sdk';
import { google } from '@ai-sdk/google';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const engine = new AIEngine({
  model: google('gemini-2.5-flash'),
  promptBuilder: new PromptBuilder(),
});

const router = new DiscordRouter({
  mode: 'slash',
  activator: 'assist',
  engine,
});

client.once(Events.ClientReady, () => {
  router.subscribe(client);
});

client.login(process.env.DISCORD_TOKEN);
```

Run:

```bash
pnpm tsx src/main.ts
```

---

## Configuration

Describe how to configure the SDK (env vars, options, safety caps, etc.).

### Environment Variables

| Name            | Required | Default | Description                                                                                     |
| --------------- | -------- | ------- | ----------------------------------------------------------------------------------------------- |
| `DISCORD_TOKEN` | yes      | —       | Discord bot token                                                                               |
| `AI_API_KEY`    | yes      | —       | API key for your AI SDK model provider (e.g., `OPENAI_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`) |
| `LOG_LEVEL`     | no       | `info`  | Log level: `debug` \| `info` \| `warn` \| `error`                                               |

### Programmatic Options

```ts
// AI engine options (all optional except model)
new AIEngine({
  model, // LanguageModel from `ai`
  maxSteps: 5,
  maxRetries: 2,
  temperature: 0,
  maxTokens: 400,
  logger: new ConsoleLogger('info'), // or use LOG_LEVEL env var
});

// Router options
new DiscordRouter({
  mode: 'slash', // 'slash' | 'message'
  activator: 'assist', // slash name or message prefix
  requiredRoleFn: async (g) => 'ROLE_ID',
  allowedChannelsFn: async (g) => ['CHANNEL_ID'],
  ephemeralReplies: true,
  engine,
});
```

---

## Usage

### Register a custom tool

```ts
import { ToolRegistry, createTool, SAFETY, discordApiTools } from 'discord-ai-sdk';
import { type Tool, tool } from 'ai';

function customTool(guild: Guild): Tool {
  return tool({
    // tool from ai sdk
  });
}

const registry = new ToolRegistry({
  tools: {
    ...discordApiTools, // if you want to keep the built in tools
    myTool: createTool(customTool, 'low'), // safety: 'low' | 'mid' | 'high'
  },
});
```

---

## Core Concepts

- AIEngine: orchestrates model calls, tools, and post-processing
- DiscordRouter: wires Discord events to the engine (slash/message modes)
- ToolRegistry: registers built-in/custom tools and filters by safety cap
- PromptBuilder: composes system and user prompts
- Safety levels: low/mid/high; router/registry enforce tool availability

---

## Examples

- `examples/`

---

## API Reference

- Key exports from `discord-ai-sdk`:
  - `AIEngine`, `DiscordRouter`, `PromptBuilder`, `RateLimiter`, `ToolRegistry`, `ConsoleLogger`
  - `discordApiTools`, `createTool`
  - `SAFETY`
  - Types: `AIEngineProps`, `LLMResult`, `DiscordRouterProps`, `ToolResult`, `AITool`, `RequestContext`

> Public APIs should be documented with TSDoc. See `docs/api/` if generated locally.

---


## Security

- Follows least-privilege principles; destructive actions require unambiguous targets
- Respects Discord permissions and role checks; do not bypass or simulate permissions
- Tools are filtered by per-guild safety cap; unavailable tools must not be invoked
- No secrets committed; use environment variables or secret stores

---

## Rate Limiting

- Default policy: per-user 3 requests per 60s (in-memory)
- Override via `new RateLimiter({ limitCount, windowMs, customRateLimits })`

---

## Contributing

We welcome contributions! Please:

1. Read `CONTRIBUTING.md`
2. Follow code style and lint rules
3. Add/adjust tests where appropriate
4. Submit a clear PR with context

---

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold it.

- See: `CODE_OF_CONDUCT.md`

---

## Security Policy

Please report vulnerabilities responsibly.

- See: `SECURITY.md`
- Private disclosures: <security-contact-email-or-link>

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---
