# Discord AI SDK

TypeScript SDK that connects Discord.js with the Vercel AI SDK to let AI safely perform Discord actions (channels, roles, members, messages, server) with guardrails.

### Features

- **AI engine**: step limits, retries, temperature/tokens, post-processing
- **Prompt builder**: strong system prompt + optional user rules
- **Tool registry**: built-in tools + custom tools with safety caps (`low`/`mid`/`high`)
- **Discord router**: message or slash modes, permission checks, channel gating, ephemeral replies, safe long-message splitting
- **Rate limiting**: per-user, overridable
- **Pluggable logging**: set via `LOG_LEVEL` or `ConsoleLogger`

### Installation

```bash
# library
pnpm add discord-ai-sdk

# peers
pnpm add ai discord.js

# choose any model provider from ai sdk
pnpm add @ai-sdk/openai
```

Requirements: Node.js 18.17+ or 20+

### Quickstart

```ts
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { AIEngine, DiscordRouter, PromptBuilder } from 'discord-ai-sdk';
import { openai } from '@ai-sdk/openai'; // model of choice from ai sdk

const client = new Client({
  // intents are required for the tools to work
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const engine = new AIEngine({
  model: openai('gpt-4o'),
  // Optional tuning: maxSteps: 5, maxRetries: 2, temperature: 0, maxTokens: 400
  promptBuilder: new PromptBuilder(),
});

const router = new DiscordRouter({
  mode: 'slash', // 'slash' | 'message'
  activator: 'assist', // slash command name or message prefix
  engine,
  // optional: ephemeralReplies: true,
  // optional: requiredRoleFn: async (g) => 'ROLE_ID',
  // optional: allowedChannelsFn: async (g) => ['CHANNEL_ID'],
});

client.once(Events.ClientReady, () => {
  router.subscribe(client);
});

client.login(process.env.DISCORD_TOKEN);
```

Run your bot:

```bash
pnpm tsx src/main.ts
```

Environment variables:

```bash
DISCORD_TOKEN=...            # from your Discord application
OPENAI_API_KEY=...           # or any model from ai sdk...
LOG_LEVEL=info               # debug | info | warn | error (optional)
```

### Configuration (at a glance)

- **Engine**: `maxSteps`, `maxRetries`, `temperature`, `maxTokens`, `promptBuilder`, `toolRegistry`, `rateLimiter`
- **Router**: `mode`, `activator`, `requiredRoleFn`, `allowedChannelsFn`, `ephemeralReplies`, `logger`
- **Rate limiter**: defaults to 3 requests / 60s per user; override with
  ```ts
  import { RateLimiter } from 'discord-ai-sdk';
  const engine = new AIEngine({
    model,
    rateLimiter: new RateLimiter({
      limitCount: 5,
      windowMs: 60_000,
      // optional: customRateLimits: async (userId, guild) => ({ limitCount: 3, windowMs: 30_000 })
    }),
  });
  ```

### Custom tools (optional)

You can add your own tools alongside the built-ins.

```ts
import { ToolRegistry, createTool, discordApiTools } from 'discord-ai-sdk';
import type { Guild } from 'discord.js';
import { tool, type Tool } from 'ai';

function myCustomTool(guild: Guild): Tool {
  return tool({
    /* ... */
  });
}

const toolRegistry = new ToolRegistry({
  tools: {
    // add the tools you want from the orginal tools
    ...discordApiTools.channelTools,
    ...discordApiTools.serverTools,
    myTool: createTool(myCustomTool, 'low'), // safety: 'low' | 'mid' | 'high'
  },
});
```

### Useful links

- **AI SDK docs**: [https://ai-sdk.dev/docs](https://ai-sdk.dev/docs)
- **discord.js guide**: [https://discord.js.org](https://discord.js.org)
- **AI SDK repo**: [https://github.com/vercel/ai](https://github.com/vercel/ai)

## Contributing

contributions are welcome, please read [`Contribution Guidelines`](CONTRIBUTING.md) before you start

---

### License

MIT — see [`LICENSE`](LICENSE).
