import { Client, GatewayIntentBits, Events } from 'discord.js';
import { AIEngine, DiscordRouter, RateLimiter } from 'discord-ai-sdk';
// model of choice from ai sdk
// @ts-expect-error - @ai-sdk/openai is not installed in this example project
import { openai } from '@ai-sdk/openai';
// @ts-expect-error - prisma is not set up in this example project
import { prisma } from './prisma';

const client = new Client({
  // intents are required for the tools to work
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const rateLimiter = new RateLimiter({
  // rate limit when customRateLimits is not provided
  limitCount: 3,
  windowMs: 60000,
  // optional for custom rate limits per user/guild
  customRateLimits: async (userId, guild) => {
    // ex: get rate limit from the database
    const user = await prisma.premiumUser.findUnique({
      where: {
        userId: userId,
        guildId: guild.id,
      },
    });
    return { limitCount: user?.rateLimitCount ?? 3, windowMs: user?.rateLimitWindowMs ?? 60000 };
  },
});

const engine = new AIEngine({
  model: openai('gpt-4o'),
  rateLimiter,
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
