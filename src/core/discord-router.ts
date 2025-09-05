import {
  Events,
  Guild,
  Message,
  PermissionsBitField,
  SlashCommandBuilder,
  type Client,
  type GuildBasedChannel,
  type Interaction,
} from 'discord.js';
import { type BotMode, type RequestContext } from './types';
import { AIError } from './error';
import { AIEngine } from './ai-engine';
import { splitMessage } from './utils/message';

export type DiscordRouterProps = {
  mode: BotMode;
  engine: AIEngine;
  activator: string;
  requiredRoleFn?: (guild: Guild) => Promise<string>;
  allowedChannelsFn?: (guild: Guild) => Promise<string[]>;
  ephemeralReplies?: boolean;
};

export class DiscordRouter {
  private mode: BotMode;
  private activator: string;
  private requiredRoleFn: ((guild: Guild) => Promise<string>) | undefined;
  private allowedChannelsFn: ((guild: Guild) => Promise<string[]>) | undefined;
  private ephemeralReplies: boolean;
  private engine: AIEngine;

  constructor({
    mode,
    engine,
    activator,
    requiredRoleFn,
    allowedChannelsFn,
    ephemeralReplies,
  }: DiscordRouterProps) {
    this.mode = mode;
    this.activator = activator;
    this.requiredRoleFn = requiredRoleFn;
    this.allowedChannelsFn = allowedChannelsFn;
    this.ephemeralReplies = ephemeralReplies ?? false;
    this.engine = engine;
  }

  public subscribe(client: Client): void {
    switch (this.mode) {
      case 'message':
        client.on(Events.MessageCreate, async (message: Message) => {
          if (!message.content.startsWith(this.activator)) return;

          try {
            const ctx = this.buildContext(message);
            const response = await this.dispatch(ctx);
            await this.sendMessageResponse(message, response);
          } catch (error) {
            console.error('Error handling message:', error);
            if (error instanceof AIError) {
              await message.reply(`Error: ${error.message}`);
            } else {
              await message.reply('Sorry, I encountered an error while processing your request.');
            }
          }
        });
        break;
      case 'slash':
        this.setupSlashCommands(client);
        break;
    }
  }

  private buildContext(event: Message | Interaction): RequestContext {
    if (!event.guild) throw new Error('No Guild');
    if (!event.channel || !event.channel.isTextBased())
      throw new Error('Channel is not text-based');

    // Ensure it's a guild-based channel (not DM)
    const channel = event.channel;
    if (!('guild' in channel) || !channel.guild) {
      throw new Error('Channel is not guild-based');
    }

    // Check if it's a message by looking for message-specific properties
    if ('author' in event && 'content' in event) {
      // This is a Message
      const message = event as Message;
      return {
        guild: message.guild!,
        channel: channel as GuildBasedChannel,
        userId: message.author.id,
        content: message.content.replace(this.activator, '').trim(),
        member: message.member,
      };
    } else if ('user' in event) {
      // This is an Interaction
      const interaction = event as Interaction;
      const prompt = interaction.isChatInputCommand()
        ? interaction.options.getString('prompt') || ''
        : '';

      return {
        guild: interaction.guild!,
        channel: channel as GuildBasedChannel,
        userId: interaction.user.id,
        content: prompt,
        member: interaction.member,
      };
    } else {
      throw new Error('Unknown event type');
    }
  }

  private async dispatch(ctx: RequestContext): Promise<string> {
    if (!(await this.hasPermission(ctx))) {
      throw new AIError('NO_PERMISSION', `User[${ctx.userId}] has no permission`);
    }

    if (!(await this.inAllowedChannel(ctx))) {
      throw new AIError('NO_PERMISSION', `Channel[${ctx.channel.id}] is not allowed to use this`);
    }

    try {
      const response = await this.engine.handle(ctx.content, ctx);
      return response;
    } catch (err) {
      console.error(err);
      if (err instanceof AIError) {
        return `Error: ${err.message}`;
      } else {
        return 'Error: Something went wrong with the AI engine.';
      }
    }
  }

  private async inAllowedChannel(ctx: RequestContext): Promise<boolean> {
    if (!this.allowedChannelsFn) return true;
    return (await this.allowedChannelsFn(ctx.guild)).includes(ctx.channel.id);
  }

  private async hasPermission(ctx: RequestContext): Promise<boolean> {
    if (!ctx.member) return false;

    if (this.requiredRoleFn) {
      const role = await this.requiredRoleFn(ctx.guild);

      if (
        'roles' in ctx.member &&
        typeof ctx.member.roles === 'object' &&
        'cache' in ctx.member.roles
      ) {
        return ctx.member.roles.cache.has(role);
      } else if ('roles' in ctx.member && Array.isArray(ctx.member.roles)) {
        return ctx.member.roles.includes(role);
      }
      return false;
    } else {
      if (
        'permissions' in ctx.member &&
        typeof ctx.member.permissions === 'object' &&
        'has' in ctx.member.permissions
      ) {
        return ctx.member.permissions.has(PermissionsBitField.Flags.Administrator);
      }
      return false;
    }
  }

  private async sendMessageResponse(message: Message, response: string): Promise<void> {
    const chunks = splitMessage(response);

    if (chunks.length > 0 && chunks[0]) {
      await message.reply(chunks[0]);

      for (let i = 1; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (chunk && 'send' in message.channel) {
          await message.channel.send(chunk);
        }
      }
    }
  }

  private async sendInteractionResponse(interaction: Interaction, response: string): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const chunks = splitMessage(response);

    if (chunks.length > 0 && chunks[0]) {
      if (interaction.deferred) {
        await interaction.editReply(chunks[0]);
      } else {
        await interaction.reply({
          content: chunks[0],
          ephemeral: this.ephemeralReplies,
        });
      }

      for (let i = 1; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (chunk) {
          await interaction.followUp({
            content: chunk,
            ephemeral: this.ephemeralReplies,
          });
        }
      }
    } else {
      const fallback = "I received your request but couldn't generate a proper response.";
      if (interaction.deferred) {
        await interaction.editReply(fallback);
      } else {
        await interaction.reply({
          content: fallback,
          ephemeral: this.ephemeralReplies,
        });
      }
    }
  }

  private setupSlashCommands(client: Client): void {
    const cmd = new SlashCommandBuilder()
      .setName(this.activator)
      .setDescription('AI can help you with stuff in the server')
      .addStringOption((option) =>
        option
          .setName('prompt')
          .setDescription('What you want the AI to help with')
          .setRequired(true),
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
      if (!interaction.isChatInputCommand()) return;
      if (interaction.commandName !== this.activator) return;

      try {
        const ctx = this.buildContext(interaction);

        await interaction.deferReply({ ephemeral: this.ephemeralReplies });

        const response = await this.dispatch(ctx);
        await this.sendInteractionResponse(interaction, response);
      } catch (error) {
        console.error('Error handling slash command:', error);

        const errorMsg =
          error instanceof AIError
            ? `Error: ${error.message}`
            : 'Sorry, I encountered an error while processing your request. Please try again.';

        try {
          if (interaction.deferred) {
            await interaction.editReply(errorMsg);
          } else {
            await interaction.reply({
              content: errorMsg,
              ephemeral: this.ephemeralReplies,
            });
          }
        } catch (replyError) {
          console.error('Failed to send error response:', replyError);
        }
      }
    });
  }
}
