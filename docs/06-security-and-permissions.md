# Security and Permissions

## Safety Caps and Tool Filtering

- Each tool has a safety level: `low`, `mid`, `high`.
- `ToolRegistry` enforces a global or per-guild safety cap; tools above the cap are hidden from the model.

## Permission Checks

- The model must not bypass Discord permissions; tools operate under the bot’s actual permissions.
- `DiscordRouter` can restrict usage via `requiredRoleFn` and `allowedChannelsFn`.

## Destructive Actions

- Destructive actions (e.g., ban/kick/delete/rename/set server name) require unambiguous targets.
- If targets are ambiguous or cannot be resolved, the action should not execute.

## Data Handling

- The SDK is stateless; no data persistence is performed.
- Secrets are read from environment variables; never print or request secrets.

## Recommended Safeguards

- Use least-privilege bot permissions in Discord.
- Configure `requiredRoleFn` and `allowedChannelsFn` to gate usage.
- Set conservative safety caps per guild; raise to `high` only when needed.
- Monitor logs (`LOG_LEVEL`) and adjust caps/rate limits accordingly.
