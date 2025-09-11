import { Client, GatewayIntentBits, Events } from 'discord.js';
import { AIEngine, createTool, discordApiTools, DiscordRouter, ToolRegistry } from 'discord-ai-sdk';
// model of choice from ai sdk
// @ts-expect-error - @ai-sdk/openai is not installed in this example project
import { openai } from '@ai-sdk/openai';
import { tool } from 'ai';
import { z } from 'zod';

const client = new Client({
  // intents are required for the tools to work
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const toolRegistry = new ToolRegistry({
  tools: {
    ...discordApiTools, // to keep the default tools when passing to engine
    myTool: createTool(
      // guild is passed in from the engine
      (guild) =>
        tool({
          description: 'my tool',
          inputSchema: z.object({
            name: z.string(),
          }),
          execute: async ({ name }) => {
            return { summary: `[${guild.name}] Hello ${name}` };
          },
        }),
      'low',
    ), // safety: 'low' | 'mid' | 'high'
  },
});

const engine = new AIEngine({
  model: openai('gpt-4o'),
  toolRegistry, // default has discordApiTools already
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
