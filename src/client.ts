import {
  Events,
  Guild,
  Message,
  SlashCommandBuilder,
  type Client,
  type Interaction,
} from 'discord.js';
import type { HandlerOptions } from './types';
import { generateText, stepCountIs, type LanguageModel } from 'ai';
import { tools } from './tools';

export type HandlerProps = {
  client: Client;
  opts: HandlerOptions;
  model: LanguageModel;
  system?: string;
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

  constructor({ client, opts, model, system }: HandlerProps) {
    this.model = model;
    if (system) this.systemPrompt += system;

    if (opts.mode === 'message-handler') {
      client.on(Events.MessageCreate, async (message: Message) => {
        if (!this.guild) this.guild = message.guild;

        if (message.content.startsWith(opts.activator)) {
          const res = await this.handle(message.content);
          await message.reply(res);
        }
      });
    } else {
      const cmd = new SlashCommandBuilder()
        .setName('aihelp')
        .setDescription('AI can help u with stuff in the server');

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
          await interaction.reply('command builder');
        }
      });
    }
  }

  private async handle(msg: string): Promise<string> {
    if (!this.guild) throw new Error('No Guild');

    console.log('Processing message:', msg);

    try {
      console.log('Available tools:', Object.keys(tools(this.guild)));

      const result = await generateText({
        model: this.model,
        prompt: msg,
        system:
          this.systemPrompt +
          (this.rules.length == 0
            ? ''
            : 'Here are rules the user has defined for this bot: ' +
              this.rules.join(',')),
        tools: tools(this.guild),
        maxRetries: 2,
        stopWhen: stepCountIs(5),
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
              // Try to extract the actual result value from the tool result
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

  extendSystem(prompt: string) {
    this.systemPrompt += prompt;
  }

  overrideSystem(prompt: string) {
    this.systemPrompt = prompt;
  }
}
