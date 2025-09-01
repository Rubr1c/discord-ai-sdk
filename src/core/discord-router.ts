import {
  Events,
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

export type DiscordRouterProps = {
  mode: BotMode;
  engine: AIEngine;
  activator: string;
  requiredRole?: string;
  allowedChannels?: string[];
  ephemeralReplies?: boolean;
};

export class DiscordRouter {
  private static readonly DISCORD_MESSAGE_LIMIT = 2000;

  private mode: BotMode;
  private activator: string;
  private requiredRole: string | undefined;
  private allowedChannels: string[];
  private ephemeralReplies: boolean;
  private engine: AIEngine;

  constructor({
    mode,
    engine,
    activator,
    requiredRole,
    allowedChannels,
    ephemeralReplies,
  }: DiscordRouterProps) {
    this.mode = mode;
    this.activator = activator;
    this.requiredRole = requiredRole;
    this.allowedChannels = allowedChannels ?? [];
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
              await message.reply(
                'Sorry, I encountered an error while processing your request.'
              );
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
    if (!this.hasPermission(ctx)) {
      throw new AIError(
        'NO_PERMISSION',
        `User[${ctx.userId}] has no permission`
      );
    }

    if (!this.inAllowedChannel(ctx)) {
      throw new AIError(
        'NO_PERMISSION',
        `Channel[${ctx.channel.id}] is not allowed to use this`
      );
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

  private inAllowedChannel(ctx: RequestContext): boolean {
    if (this.allowedChannels.length === 0) return true;
    return this.allowedChannels.includes(ctx.channel.name);
  }

  private hasPermission(ctx: RequestContext): boolean {
    if (!ctx.member) return false;

    if (this.requiredRole) {
      if (
        'roles' in ctx.member &&
        typeof ctx.member.roles === 'object' &&
        'cache' in ctx.member.roles
      ) {
        return ctx.member.roles.cache.has(this.requiredRole);
      } else if ('roles' in ctx.member && Array.isArray(ctx.member.roles)) {
        return ctx.member.roles.includes(this.requiredRole);
      }
      return false;
    } else {
      if (
        'permissions' in ctx.member &&
        typeof ctx.member.permissions === 'object' &&
        'has' in ctx.member.permissions
      ) {
        return ctx.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        );
      }
      return false;
    }
  }

  private splitMessage(message: string): string[] {
    if (message.length <= DiscordRouter.DISCORD_MESSAGE_LIMIT) {
      return [message];
    }

    const chunks: string[] = [];
    let currentChunk = '';

    // Split by lines first to avoid breaking in the middle of sentences
    const lines = message.split('\n');

    for (const line of lines) {
      // If a single line is too long, we need to split it by words
      if (line.length > DiscordRouter.DISCORD_MESSAGE_LIMIT) {
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
            DiscordRouter.DISCORD_MESSAGE_LIMIT
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
          DiscordRouter.DISCORD_MESSAGE_LIMIT
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

  private async sendMessageResponse(
    message: Message,
    response: string
  ): Promise<void> {
    const chunks = this.splitMessage(response);

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

  private async sendInteractionResponse(
    interaction: Interaction,
    response: string
  ): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const chunks = this.splitMessage(response);

    // Send the first chunk as the initial reply
    if (chunks.length > 0 && chunks[0]) {
      if (interaction.deferred) {
        await interaction.editReply(chunks[0]);
      } else {
        await interaction.reply({
          content: chunks[0],
          ephemeral: this.ephemeralReplies,
        });
      }

      // Send additional chunks as follow-up messages
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
      const fallback =
        "I received your request but couldn't generate a proper response.";
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
      if (!interaction.isChatInputCommand()) return;
      if (interaction.commandName !== this.activator) return;

      try {
        const ctx = this.buildContext(interaction);

        // Defer the reply since AI processing might take time
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
