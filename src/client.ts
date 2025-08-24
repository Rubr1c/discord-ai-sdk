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

    const { text } = await generateText({
      model: this.model,
      prompt: msg,
      system:
        'You are an ai helper on discord. make sure to always respond with something. dont ask a follow up just do what u can and if you cant explain that',
      tools: tools(this.guild),
    });

    return text;
  }
}
