import { Client, GatewayIntentBits, Events } from 'discord.js';
import { AIEngine, DiscordRouter } from 'discord-ai-sdk';
// model of choice from ai sdk
// @ts-expect-error - @ai-sdk/openai is not installed in this example project
import { openai } from '@ai-sdk/openai';

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
  maxSteps: 10, // max steps for the model
  maxRetries: 2, // max retries for the model
  temperature: 0.5, // temperature for the model
  maxTokens: 1000, // max tokens for the model
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
