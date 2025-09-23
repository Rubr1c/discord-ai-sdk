import { Client, GatewayIntentBits, Events } from 'discord.js';
import { AIEngine, DiscordRouter, PromptBuilder } from 'discord-ai-sdk';
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

const promptBuilder = new PromptBuilder({
  system: 'You are a helpful assistant.', // system prompt
  override: true, // override the system prompt
});

// override the system prompt with a new system prompt
promptBuilder.override('You are a helpful assistant.');

// add a rule to the system prompt
promptBuilder.addRule('You are a helpful assistant.');

// remove a rule from the system prompt
promptBuilder.removeRule('You are a helpful assistant.');

// reset the rules
promptBuilder.resetRules();

const engine = new AIEngine({
  model: openai('gpt-4o'),
  promptBuilder,
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
