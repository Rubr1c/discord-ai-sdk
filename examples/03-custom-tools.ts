import { Client, GatewayIntentBits, Events } from 'discord.js';
import { AIEngine, createTool, discordApiTools, DiscordRouter, ToolRegistry } from 'discord-ai-sdk';
// model of choice from ai sdk
// @ts-expect-error - @ai-sdk/openai is not installed in this example project
import { openai } from '@ai-sdk/openai';
import { tool } from 'ai';
import { z } from 'zod';
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

const toolRegistry = new ToolRegistry({
  tools: {
    // add the tools you want from the orginal tools
    ...discordApiTools.channelTools,
    ...discordApiTools.serverTools,
    myTool: createTool({
      // guild and logger is passed in from the engine
      tool: ({ guild, logger }) =>
        tool({
          description: 'my tool',
          inputSchema: z.object({
            name: z.string(),
          }),
          execute: async ({ name }: { name: string }) => {
            // using logger
            logger?.info({
              message: 'myTool called',
              meta: { name },
            });
            return { summary: `[${guild.name}] Hello ${name}` };
          },
        }),
      safetyLevel: 'low', // safety: 'low' | 'mid' | 'high'
    }),
  },
});

toolRegistry.addTool(
  'myTool2',
  createTool({
    tool: ({ guild }) =>
      tool({
        description: 'my tool',
        inputSchema: z.object({
          name: z.string(),
        }),
        execute: async ({ name }) => {
          return { summary: `[${guild.name}] Hello ${name}` };
        },
      }),
    safetyLevel: 'low',
  }),
  true, // overwrite the tool if it already exists
);

toolRegistry.removeTool('myTool2');

// set the safety mode cap function
toolRegistry.setSafetyModeCap(async (guild) => {
  const guildData = await prisma.guilds.findUnique({
    where: {
      id: guild.id,
    },
  });
  return guildData?.safetyModeCap ?? 'high';
});
//or set the safety mode cap globally with a string
toolRegistry.setSafetyModeCap('low');

// return a single tool
toolRegistry.getTool('myTool2');

// return all tools
toolRegistry.getAllTools();

// @ts-expect-error - missing context
toolRegistry.getAllAvailableTools(context);

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
