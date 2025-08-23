import {
  Events,
  Message,
  SlashCommandBuilder,
  type Client,
  type Interaction,
} from 'discord.js';
import type { HandlerOptions } from './types';

export class DiscordAIHandler {
  constructor(client: Client, opts: HandlerOptions) {
    if (opts.mode == 'message-handler') {
      client.on(Events.MessageCreate, async (message: Message) => {
        if (message.content == opts.activator) {
          await message.reply('msg handler');
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
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'aihelp') {
          await interaction.reply('command builder');
        }
      });
    }
  }
}
