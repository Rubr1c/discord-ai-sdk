import {
  Collection,
  Events,
  Guild,
  Message,
  SlashCommandBuilder,
  type Client,
  type Interaction,
} from 'discord.js';
import type { HandlerOptions } from './types';
import { generateText, stepCountIs, type LanguageModel, type Tool } from 'ai';
import { tools } from './tools';

export type HandlerProps = {
  client: Client;
  bot_opts: HandlerOptions;
  model: LanguageModel;
  system?: string;
  maxSteps?: number;
  maxRetries?: number;
  tools?: Record<string, Tool>;
};

export class DiscordAIHandler {
  private guild: Guild | null = null;
  private model: LanguageModel;
  private systemPrompt: string = `
   You are a Discord server management AI (discord bot). You have tools to manage a discord server.
 
   IMPORTANT RULES:
   1. ALWAYS use the appropriate tools to fulfill user requests
   2. Use MULTIPLE tools in sequence when needed (e.g., getCategories then createChannel)
   3. When creating channels in categories, first use getCategories to find the category ID, then use createChannel
   4. When creating roles, use administrator: true for admin roles
   5. Pick sensible defaults for colors and other optional parameters
   6. ALWAYS respond with descriptive text explaining what you did
   7. NEVER ask follow-up questions - just do what you can with the available tools`;

  private rules: string[] = [];
  private maxSteps: number = 5;
  private tools: Record<string, Tool> | null = null;
  private static readonly DISCORD_MESSAGE_LIMIT = 2000;

  /**
   * Splits a message into chunks that respect Discord's message limit
   */
  private splitMessage(message: string): string[] {
    if (message.length <= DiscordAIHandler.DISCORD_MESSAGE_LIMIT) {
      return [message];
    }

    const chunks: string[] = [];
    let currentChunk = '';

    // Split by lines first to avoid breaking in the middle of sentences
    const lines = message.split('\n');

    for (const line of lines) {
      // If a single line is too long, we need to split it by words
      if (line.length > DiscordAIHandler.DISCORD_MESSAGE_LIMIT) {
        // First, add any current chunk if it exists
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }

        // Split the long line by words
        const words = line.split(' ');
        for (const word of words) {
          if (
            (currentChunk + word + ' ').length >
            DiscordAIHandler.DISCORD_MESSAGE_LIMIT
          ) {
            if (currentChunk.trim()) {
              chunks.push(currentChunk.trim());
            }
            currentChunk = word + ' ';
          } else {
            currentChunk += word + ' ';
          }
        }
      } else {
        // Check if adding this line would exceed the limit
        if (
          (currentChunk + line + '\n').length >
          DiscordAIHandler.DISCORD_MESSAGE_LIMIT
        ) {
          if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
          }
          currentChunk = line + '\n';
        } else {
          currentChunk += line + '\n';
        }
      }
    }

    // Add the last chunk if it exists
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [message];
  }

  constructor({
    client,
    bot_opts,
    model,
    system,
    maxSteps,
    tools,
  }: HandlerProps) {
    this.model = model;
    if (tools) this.tools = tools;
    if (system) this.systemPrompt += system;
    if (maxSteps) this.maxSteps = maxSteps;

    if (bot_opts.mode === 'message-handler') {
      client.on(Events.MessageCreate, async (message: Message) => {
        if (!this.guild) this.guild = message.guild;

        if (message.content.startsWith(bot_opts.activator)) {
          const res = await this.handle(message.content);
          const chunks = this.splitMessage(res);

          // Send the first chunk as a reply
          if (chunks.length > 0 && chunks[0]) {
            await message.reply(chunks[0]);

            // Send additional chunks as follow-up messages
            for (let i = 1; i < chunks.length; i++) {
              const chunk = chunks[i];
              if (chunk && 'send' in message.channel) {
                await message.channel.send(chunk);
              }
            }
          }
        }
      });
    } else {
      const cmd = new SlashCommandBuilder()
        .setName('aihelp')
        .setDescription('AI can help u with stuff in the server')
        .addStringOption((option) =>
          option
            .setName('prompt')
            .setDescription('What you want the AI to help with')
            .setRequired(true)
        );

      client.once(Events.ClientReady, async () => {
        try {
          await client.application?.commands.create(cmd);
          console.log('AI Command Created');
        } catch (error) {
          console.error('Failed to register slash command:', error);
        }
      });

      client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        if (!this.guild) this.guild = interaction.guild;

        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName === 'aihelp') {
          const prompt = interaction.options.getString('prompt');
          if (!prompt) {
            await interaction.reply(
              'Please provide a prompt for the AI to help with.'
            );
            return;
          }

          // Defer the reply since AI processing might take time
          await interaction.deferReply();

          try {
            const res = await this.handle(prompt);
            const chunks = this.splitMessage(res);

            // Send the first chunk as the initial reply
            if (chunks.length > 0 && chunks[0]) {
              await interaction.editReply(chunks[0]);

              // Send additional chunks as follow-up messages
              for (let i = 1; i < chunks.length; i++) {
                const chunk = chunks[i];
                if (chunk) {
                  await interaction.followUp(chunk);
                }
              }
            } else {
              await interaction.editReply(
                "I received your request but couldn't generate a proper response."
              );
            }
          } catch (error) {
            console.error('Error handling slash command:', error);
            await interaction.editReply(
              'Sorry, I encountered an error while processing your request. Please try again.'
            );
          }
        }
      });
    }
  }

  private async handle(msg: string): Promise<string> {
    if (!this.guild) throw new Error('No Guild');

    console.log('Processing message:', msg);

    if (!this.tools) {
      this.tools = tools(this.guild);
    }

    try {
      console.log('Available tools:', Object.keys(this.tools));

      const result = await generateText({
        model: this.model,
        prompt: msg,
        system:
          this.systemPrompt +
          (this.rules.length == 0
            ? ''
            : '\nHere are rules the user has defined for this bot: ' +
              this.rules.join(',')),
        tools: this.tools,
        maxRetries: 2,
        stopWhen: stepCountIs(this.maxSteps),
      });

      const { text, toolResults } = result;

      console.log('AI Response text:', JSON.stringify(text));
      console.log('Tool results:', toolResults?.length || 0, 'tools used');

      if (toolResults && toolResults.length > 0) {
        console.log(
          'Tools used:',
          toolResults.map((r) => r.toolName)
        );
      }

      if (!text || text.trim() === '') {
        console.log('Empty text response detected');
        if (toolResults && toolResults.length > 0) {
          // Return the actual tool output when AI doesn't provide text
          const toolOutput = toolResults
            .map((result) => {
              const resultValue =
                (result as any).result ||
                (result as any).output ||
                'Tool executed successfully';
              return typeof resultValue === 'string'
                ? resultValue
                : JSON.stringify(resultValue);
            })
            .join('\n\n');
          return toolOutput;
        }
        return "I received your message but couldn't generate a proper response. Please try rephrasing your request.";
      }

      console.log('Returning text response');
      return text;
    } catch (error) {
      console.error('AI generation error:', error);
      return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
  }

  addRule(rule: string) {
    this.rules.push(rule);
  }

  removeRule(rule: string) {
    this.rules = this.rules.filter((r) => r != rule);
  }

  extendSystem(prompt: string) {
    this.systemPrompt += prompt;
  }

  overrideSystem(prompt: string) {
    this.systemPrompt = prompt;
  }

  addTools(tools: Record<string, Tool>) {
    this.tools = { ...this.tools, ...tools };
  }

  setTools(tools: Record<string, Tool>) {
    this.tools = tools;
  }

  clearTools() {
    this.tools = {};
  }

  resetTools() {
    this.tools = null;
  }
}
