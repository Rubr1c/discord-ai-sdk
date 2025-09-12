# Tools Overview

## Structure

- **Zod input**: Each tool defines an `inputSchema` with `zod` for safe, typed inputs.
- **Standardized result**: Tools return `{ summary: string, data?: unknown }` (`ToolResult<T>`), summarized for end users.
- **Binding**: Tools are factory functions `tool(guild)` returning an `ai` Tool bound to a specific `Guild`.
- **Safety level**: Registered with a safety level (`low`, `mid`, `high`) to allow filtering.

## Families

- **Channels**: create, fetch, delete, rename, move
- **Categories**: create, fetch, delete
- **Roles**: create, fetch, update, assign/remove, delete, resolve role ID
- **Members**: fetch, resolve user ID, kick, ban/unban, timeout/untimeout
- **Messages**: send, fetch, delete, pin/unpin
- **Server**: fetch server info, list emojis/stickers, set server name

All tools follow the same schema/execute pattern; destructive tools are marked with higher safety levels.

## Representative Examples

### sendMessage (messages)

Input and behavior:

```ts
// input
{
  channelId: string;           // id of channel
  content: string;             // 1..2000 characters
}

// result shape (success)
{ summary: `Sent message to <#channelId>`, data: { id: string, url: string, channelId: string } }
```

### createRole (roles)

Input and behavior:

```ts
// input
{
  name: string;
  color?: string | null;       // hex like "ff0000" (defaults to Discord blue 5865F2)
  mentionable?: boolean;       // default true
  permissions?: {              // zod schema with granular flags or administrator
    administrator?: boolean;
    manageGuild?: boolean;
    // ... see role-permissions in sources
  };
}

// result shape (success)
{ summary: `Created role: <name> with <permSummary>`, data: { id: string } }
```

## Extensibility

Add custom tools with `createTool((guild) => ai.tool({...}), safetyLevel)` and register them in a `ToolRegistry` alongside the built-ins. Use safety levels to control availability via per-guild caps.
