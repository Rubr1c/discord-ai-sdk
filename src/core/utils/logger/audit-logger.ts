import { EmbedBuilder, type Guild } from 'discord.js';
import { BaseLogger } from './base-logger';
import type { LoggerParams, LogLevel } from '@/core/types';

export class AuditLogger extends BaseLogger {
  private auditLogFn: (guild: Guild) => Promise<{ channelId?: string }>;
  private queue: { embed: EmbedBuilder; guild: Guild }[] = [];
  private isFlushing = false;
  private flushInterval = 2000;

  constructor(level: LogLevel, auditLogFn: (guild: Guild) => Promise<{ channelId?: string }>) {
    super(level);
    this.auditLogFn = auditLogFn;
    this.startFlusher();
  }

  private startFlusher() {
    setInterval(() => this.flushQueue(), this.flushInterval);
  }

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

  private enqueue({
    guild,
    level,
    message,
    meta,
  }: {
    level: LogLevel;
    message: string;
    guild?: Guild;
    meta?: unknown;
  }) {
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
