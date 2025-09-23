import { Client, GatewayIntentBits, Events } from 'discord.js';
import {
  AIEngine,
  AuditLogger,
  CompositeLogger,
  ConsoleLogger,
  DiscordRouter,
} from 'discord-ai-sdk';
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

// console logger is used to log logs to the console
const logger = new ConsoleLogger({ level: 'debug' });
// audit logger is used to log audit logs to a specific channel fetched with a async function
const auditLogger = new AuditLogger({
  level: 'debug',
  auditLogFn: async (guild) => {
    const guildData = await prisma.guilds.findUnique({
      where: {
        id: guild.id,
      },
    });
    return { channelId: guildData?.auditChannelId };
  },
});
// composite logger is used to log logs to multiple loggers
const compositeLogger = new CompositeLogger([logger, auditLogger]);

const engine = new AIEngine({
  model: openai('gpt-4o'),
  // logger passed here will be passed to all other components unless set manually
  logger: compositeLogger,
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
