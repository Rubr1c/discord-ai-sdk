# Configuration

## Engine Options

AIEngine constructor options (defaults shown):

- `model`: Language model from `ai` (required)
- `promptBuilder`: `new PromptBuilder('', false, logger)`
- `toolRegistry`: `new ToolRegistry({ tools: discordApiTools, logger })`
- `rateLimiter`: `new RateLimiter({ limitCount: 3, windowMs: 60000, logger })`
- `maxRetries`: 2
- `maxSteps`: 5
- `temperature`: 0
- `maxTokens`: 400

## Router Options

- `mode`: `'slash' | 'message'`
- `engine`: `AIEngine`
- `activator`: string (slash command name or message prefix)
- `requiredRoleFn?`: `(guild) => Promise<string>`
- `allowedChannelsFn?`: `(guild) => Promise<string[]>`
- `ephemeralReplies?`: boolean (default false)
- `logger?`: defaults to engine logger

## Rate Limiter Options

- `limitCount`: number of requests per window
- `windowMs`: window length in ms
- `customRateLimits?`: `(userId, guild) => Promise<{ limitCount: number; windowMs: number }>`

## Environment Variables

| Variable        | Description                                                  |
| --------------- | ------------------------------------------------------------ | ------ | ------ | ------- |
| `DISCORD_TOKEN` | Discord bot token                                            |
| `AI_API_KEY`    | Provider API key used by the AI SDK (e.g., `OPENAI_API_KEY`) |
| `LOG_LEVEL`     | `debug`                                                      | `info` | `warn` | `error` |

## Path Alias

Configured in `tsconfig.json` and `vitest.config.ts`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## TypeScript Strict Settings

The project ships with strict options enabled (e.g., `strict`, `noUncheckedIndexedAccess`, `noImplicitReturns`). Avoid `any`; prefer `unknown` with narrowing.

## Required Discord Intents

At minimum for messaging tools:

```ts
intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
];
```

## Security Stance

- **Destructive actions must be unambiguous** (e.g., delete/ban/kick/rename/set-server-name). If the target cannot be resolved with certainty, do not act.
- **Permission checks respected** at runtime via Discord roles/permissions and optional router gates.
