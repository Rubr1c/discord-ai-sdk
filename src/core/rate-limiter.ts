import type { Guild } from 'discord.js';
import type { RequestContext } from './types';

export interface RateLimitOpts {
  limitCount: number;
  windowMs: number;
}

export type RateLimitFn = ((userId: string, guild: Guild) => Promise<RateLimitOpts>) | undefined;

export class RateLimiter {
  private opts: RateLimitOpts;
  private readonly requestTimestamps = new Map<string, number[]>();
  private customRateLimits: RateLimitFn;

  constructor(limitCount: number, windowMs: number, customRateLimits?: RateLimitFn) {
    this.opts = { limitCount, windowMs };
    this.customRateLimits = customRateLimits;
  }

  public async isRateLimited(ctx: RequestContext): Promise<boolean> {
    const rate = this.customRateLimits
      ? await this.customRateLimits(ctx.userId, ctx.guild)
      : this.opts;

    const now = Date.now();
    const startWindow = now - rate.windowMs;

    const scopeTimestamps = this.requestTimestamps.get(ctx.userId) ?? [];

    // Clean old timestamps to prevent memory bloat
    const recentTimestamps = scopeTimestamps.filter((timestamp) => timestamp > startWindow);

    if (recentTimestamps.length >= rate.limitCount) {
      // Update with cleaned timestamps even when rate limited
      this.requestTimestamps.set(ctx.userId, recentTimestamps);
      return true;
    }

    recentTimestamps.push(now);
    this.requestTimestamps.set(ctx.userId, recentTimestamps);

    return false;
  }
}
