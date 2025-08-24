import {
  Events,
  Guild,
  Message,
  SlashCommandBuilder,
  type Client,
  type Interaction,
} from 'discord.js';
import type { HandlerOptions } from './types';
import { generateText, type LanguageModel } from 'ai';
import { tools } from './tools';

export class DiscordAIHandler {
  private guild: Guild | null = null;
  private model: LanguageModel;

  constructor({
    client,
    opts,
    model,
  }: {
    client: Client;
    opts: HandlerOptions;
    model: LanguageModel;
  }) {
    this.model = model;
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

    console.log('🔍 Processing message:', msg);

    try {
      console.log('Available tools:', Object.keys(tools(this.guild)));

      const result = await generateText({
        model: this.model,
        prompt: msg,
        system: `You are a Discord server management AI. You have tools to create roles and channels.

IMPORTANT RULES:
1. ALWAYS respond with descriptive text explaining what you did
2. NEVER ask follow-up questions - just do what you can
3. For role creation, use the createRole tool with these parameters:
   - name: string (role name)
   - primaryColor: hex color like "#ff0000" for red
   - permissions: object with boolean flags like {administrator: true}
4. If user wants "admin" role, set permissions: {administrator: true}
5. Always be creative and pick good defaults

Example: For "Lightning McQueen themed role" you should:
- Pick a name like "Speed Racer" or "Ka-chiga"  
- Use red color "#ff0000" (Lightning McQueen's color)
- Give appropriate permissions`,
        tools: tools(this.guild),
        maxRetries: 2,
      });

      const { text, toolResults } = result;

      console.log('AI Response text:', JSON.stringify(text));
      console.log('Tool results:', toolResults?.length || 0, 'tools used');

      if (toolResults && toolResults.length > 0) {
        console.log(
          '🛠️ Tools used:',
          toolResults.map((r) => r.toolName)
        );
      }

      if (!text || text.trim() === '') {
        console.log('Empty text response detected');
        if (toolResults && toolResults.length > 0) {
          return 'I completed the requested action (tools were used but no description was generated).';
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
}
