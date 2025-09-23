import { EmbedBuilder, type Guild } from 'discord.js';
import { BaseLogger } from './base-logger';
import type { LoggerParams, LogLevel } from '@/core/types';

export interface AuditLoggerProps {
  /**
   * The log level. @default 'info'
   */
  level: LogLevel;
  /**
   * The function that returns the channel ID to audit log.
   */
  auditLogFn: (guild: Guild) => Promise<{ channelId?: string }>;
  /**
   * The flush interval in milliseconds to send the logs to the audit log channel. @default 2000
   */
  flushInterval?: number;
}

interface LogQueueItem {
  /**
   * The embed to audit log.
   */
  embed: EmbedBuilder;
  /**
   * The guild to audit log.
   */
  guild: Guild;
}

interface EnqueueParams extends Omit<LoggerParams, 'error'> {
  /**
   * The log level.
   */
  level: LogLevel;
}

/**
 * The audit logger.
 */
export class AuditLogger extends BaseLogger {
  private auditLogFn: (guild: Guild) => Promise<{ channelId?: string }>;

  private flushInterval: number;

  private queue: LogQueueItem[] = [];
  private isFlushing = false;

  constructor({ level, auditLogFn, flushInterval = 2000 }: AuditLoggerProps) {
    super({ level });
    this.auditLogFn = auditLogFn;
    this.flushInterval = flushInterval;
    this.startFlusher();
  }

  /**
   * Starts the flusher.
   */
  private startFlusher() {
    setInterval(() => this.flushQueue(), this.flushInterval);
  }

  /**
   * Flushes the first item in the queue to the audit log channel.
   */
  private async flushQueue() {
    if (this.isFlushing || this.queue.length === 0) return;
    this.isFlushing = true;

    const item = this.queue.shift();
    if (!item) return;

    try {
      const channelId = await this.auditLogFn(item.guild).then((r) => r.channelId);
      const channel = channelId ? await item.guild.channels.fetch(channelId) : null;

      if (channel?.isTextBased()) {
        await channel.send({ embeds: [item.embed] });
      }
    } catch (err) {
      console.error('Audit log flush failed:', err);
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Enqueues a log item.
   * @param params - The log parameters.
   */
  private enqueue({ guild, level, message, meta }: EnqueueParams) {
    if (!guild || !this.shouldLog(level)) return;
    const embed = this.buildEmbed(level, message, meta);
    this.queue.push({ embed, guild });
  }

  debug(params: LoggerParams) {
    this.enqueue({ ...params, level: 'debug' });
  }
  info(params: LoggerParams) {
    this.enqueue({ ...params, level: 'info' });
  }
  warn(params: LoggerParams) {
    this.enqueue({ ...params, level: 'warn' });
  }
  error(params: LoggerParams) {
    const { guild, error, message, meta } = params;
    this.enqueue({
      level: 'error',
      ...(guild && { guild }),
      message: error?.message ?? message,
      meta,
    });
  }

  /**
   * Builds an embed for the log.
   * @param level - The log level.
   * @param message - The log message.
   * @param meta - The log metadata.
   * @returns The embed.
   */
  private buildEmbed(level: LogLevel, message: string, meta?: unknown): EmbedBuilder {
    const colors: Record<LogLevel, number> = {
      debug: 0x808080,
      info: 0x0099ff,
      warn: 0xffa500,
      error: 0xff0000,
    };

    const embed = new EmbedBuilder()
      .setColor(colors[level])
      .setTitle(level.toUpperCase())
      .setDescription(`**[${this.formatTimestamp()}]** ${message}`);

    if (meta !== undefined && meta !== null) {
      const metaString = this.formatMeta(meta);
      embed.addFields({ name: 'Meta', value: metaString });
    }

    return embed;
  }

  /**
   * Formats the metadata.
   * @param meta - The metadata.
   * @returns The formatted metadata.
   */
  private formatMeta(meta: unknown): string {
    if (typeof meta === 'string') {
      return meta;
    }

    if (typeof meta === 'object' && meta !== null) {
      const obj = meta as Record<string, unknown>;
      const fields = Object.entries(obj)
        .map(([key, value]) => `**${key}:** ${value}`)
        .join('\n');
      return fields;
    }

    return String(meta);
  }

  public setFlushInterval(interval: number) {
    this.flushInterval = interval;
  }
}
