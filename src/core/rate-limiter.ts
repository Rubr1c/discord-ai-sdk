import type { Guild } from 'discord.js';
import type { Logger, RequestContext } from './types';
import { ConsoleLogger } from './console-logger';

/**
 * Rate limit options.
 */
export interface RateLimitOpts {
  /** The limit count. */
  limitCount: number;
  /** The window in milliseconds. */
  windowMs: number;
}

/**
 * Rate limit function.
 */
export type RateLimitFn = ((userId: string, guild: Guild) => Promise<RateLimitOpts>) | undefined;

/**
 * Rate limiter properties.
 */
export interface RateLimiterProps extends RateLimitOpts {
  customRateLimits?: RateLimitFn;
  logger?: Logger;
}

/**
 * Rate limiter.
 */
export class RateLimiter {
  private opts: RateLimitOpts;
  private readonly requestTimestamps = new Map<string, number[]>();
  private customRateLimits: RateLimitFn;
  private logger: Logger;

  /**
   * Creates a rate limiter.
   * @param options - The options for the rate limiter.
   * @example
   * const rateLimiter = new RateLimiter({
   *   limitCount: 3,
   *   windowMs: 60000,
   *   logger: new ConsoleLogger(),
   * });
   */
  constructor({ limitCount, windowMs, customRateLimits, logger }: RateLimiterProps) {
    this.opts = { limitCount, windowMs };
    this.customRateLimits = customRateLimits;
    this.logger = logger ?? new ConsoleLogger();
  }

  /**
   * Checks if the user is rate limited.
   * @param ctx - The context.
   * @returns True if the user is rate limited, false otherwise.
   */
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

  /**
   * Resets all the rate limits.
   */
  public resetAll() {
    this.requestTimestamps.clear();
    this.logger.info('RateLimiter.resetAll');
  }

  /**
   * Resets the rate limit for a user.
   * @param userId - The user ID.
   */
  public resetFor(userId: string) {
    this.requestTimestamps.set(userId, []);
    this.logger.info('RateLimiter.resetFor', { userId });
  }
}
