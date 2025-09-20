import { EmbedBuilder, type Guild } from 'discord.js';
import { LOG_LEVEL_ORDER, type Logger, type LogLevel } from '../types';

export class AuditLogger implements Logger {
  private auditLogFn: (guild: Guild) => Promise<{ channelId?: string }>;
  private guild: Guild | null = null;
  public level: LogLevel;

  constructor(level: LogLevel, auditLogFn: (guild: Guild) => Promise<{ channelId?: string }>) {
    this.auditLogFn = auditLogFn;
    this.level = level;
  }

  /**
   * Checks if a log level should be logged.
   * @param level - The level to check.
   * @returns True if the level should be logged, false otherwise.
   */
  public shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[this.level];
  }

  public setGuild(guild: Guild) {
    this.guild = guild;
  }

  public async getChannelId(): Promise<string | undefined> {
    if (!this.guild) {
      return undefined;
    }
    try {
      const result = await this.auditLogFn(this.guild);
      return result?.channelId;
    } catch (error) {
      console.error('Error getting audit channel ID:', error);
      return undefined;
    }
  }

  async debug(message: string, meta?: unknown): Promise<void> {
    if (!this.guild) {
      return;
    }
    try {
      console.log('fetching channel id');
      const channelId = await this.getChannelId();
      if (channelId) {
        console.log('fetching channel');
        const channel = await this.guild.channels.fetch(channelId);

        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle('Debug')
          .setDescription(message)
          .setTimestamp();

        if (meta !== undefined && meta !== null) {
          const metaString = typeof meta === 'string' ? meta : JSON.stringify(meta);
          embed.addFields({ name: 'Meta', value: metaString });
        }

        if (channel?.isTextBased()) {
          console.log('sending embed');
          await channel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error('Error in audit debug logging:', error);
    }
  }

  async info(message: string, meta?: unknown): Promise<void> {
    if (!this.guild) {
      return;
    }

    try {
      const channelId = await this.getChannelId();
      if (channelId) {
        const channel = await this.guild.channels.fetch(channelId);

        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle('Info')
          .setDescription(message)
          .setTimestamp();

        if (meta !== undefined && meta !== null) {
          const metaString = typeof meta === 'string' ? meta : JSON.stringify(meta);
          embed.addFields({ name: 'Meta', value: metaString });
        }

        if (channel?.isTextBased()) {
          await channel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error('Error in audit info logging:', error);
    }
  }
  async warn(message: string, meta?: unknown): Promise<void> {
    if (!this.guild) {
      return;
    }

    try {
      const channelId = await this.getChannelId();
      if (channelId) {
        const channel = await this.guild.channels.fetch(channelId);

        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle('Warn')
          .setDescription(message)
          .setTimestamp();

        if (meta !== undefined && meta !== null) {
          const metaString = typeof meta === 'string' ? meta : JSON.stringify(meta);
          embed.addFields({ name: 'Meta', value: metaString });
        }

        if (channel?.isTextBased()) {
          await channel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error('Error in audit warn logging:', error);
    }
  }

  async error(message: string | Error, meta?: unknown): Promise<void> {
    if (!this.guild) {
      return;
    }

    try {
      const channelId = await this.getChannelId();
      if (channelId) {
        const channel = await this.guild.channels.fetch(channelId);

        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle('Error')
          .setDescription(message instanceof Error ? message.message : message)
          .setTimestamp();

        if (meta !== undefined && meta !== null) {
          const metaString = typeof meta === 'string' ? meta : JSON.stringify(meta);
          embed.addFields({ name: 'Meta', value: metaString });
        }

        if (channel?.isTextBased()) {
          await channel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error('Error in audit error logging:', error);
    }
  }
}
