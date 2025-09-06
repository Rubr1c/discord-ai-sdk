import type { Guild } from 'discord.js';
import type { Logger, RequestContext } from './types';
import { ConsoleLogger } from './console-logger';

export interface RateLimitOpts {
  limitCount: number;
  windowMs: number;
}

export type RateLimitFn = ((userId: string, guild: Guild) => Promise<RateLimitOpts>) | undefined;

export interface RateLimiterProps extends RateLimitOpts {
  customRateLimits?: RateLimitFn;
  logger?: Logger;
}

export class RateLimiter {
  private opts: RateLimitOpts;
  private readonly requestTimestamps = new Map<string, number[]>();
  private customRateLimits: RateLimitFn;
  private logger: Logger;

  constructor({ limitCount, windowMs, customRateLimits, logger }: RateLimiterProps) {
    this.opts = { limitCount, windowMs };
    this.customRateLimits = customRateLimits;
    this.logger = logger ?? new ConsoleLogger();
  }

  public async isRateLimited(ctx: RequestContext): Promise<boolean> {
    const rate = this.customRateLimits
      ? await this.customRateLimits(ctx.userId, ctx.guild)
      : this.opts;

    const now = Date.now();
    const startWindow = now - rate.windowMs;

    const scopeTimestamps = this.requestTimestamps.get(ctx.userId) ?? [];

    const recentTimestamps = scopeTimestamps.filter((timestamp) => timestamp > startWindow);

    if (recentTimestamps.length >= rate.limitCount) {
      this.logger.warn('RateLimiter.isRateLimited: true', {
        userId: ctx.userId,
        guildId: ctx.guild.id,
      });
      this.requestTimestamps.set(ctx.userId, recentTimestamps);
      return true;
    }

    recentTimestamps.push(now);
    this.requestTimestamps.set(ctx.userId, recentTimestamps);

    this.logger.debug('RateLimiter.isRateLimited: false', {
      userId: ctx.userId,
      guildId: ctx.guild.id,
    });
    return false;
  }

  public resetAll() {
    this.requestTimestamps.clear();
    this.logger.info('RateLimiter.resetAll');
  }

  public resetFor(userId: string) {
    this.requestTimestamps.set(userId, []);
    this.logger.info('RateLimiter.resetFor', { userId });
  }
}
