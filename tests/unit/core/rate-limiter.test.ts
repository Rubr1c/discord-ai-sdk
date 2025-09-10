import { describe, it, expect } from 'vitest';
import { RateLimiter } from '@/core/rate-limiter';
import { makeContext } from 'tests/utils/context';
import { createFakeGuild, createFakeTextChannel } from 'tests/utils/discord';

describe('RateLimiter', () => {
  it('should return false if the user is not rate limited', async () => {
    const ctx = makeContext({ guild: createFakeGuild(), channel: createFakeTextChannel() });
    const rateLimiter = new RateLimiter({ limitCount: 1, windowMs: 1000 });
    const isRateLimited = await rateLimiter.isRateLimited(ctx);
    expect(isRateLimited).toBe(false);
  });

  it('should return true if the user is rate limited', async () => {
    const ctx = makeContext({ guild: createFakeGuild(), channel: createFakeTextChannel() });
    const rateLimiter = new RateLimiter({ limitCount: 1, windowMs: 1000 });
    for (let i = 0; i < 2; i++) {
      await rateLimiter.isRateLimited(ctx);
    }
    const isRateLimited = await rateLimiter.isRateLimited(ctx);
    expect(isRateLimited).toBe(true);
  });

  it('should return false if the user is not rate limited after the windowMs', async () => {
    const ctx = makeContext({ guild: createFakeGuild(), channel: createFakeTextChannel() });
    const rateLimiter = new RateLimiter({ limitCount: 1, windowMs: 1000 });
    for (let i = 0; i < 2; i++) {
      await rateLimiter.isRateLimited(ctx);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const isRateLimited = await rateLimiter.isRateLimited(ctx);
    expect(isRateLimited).toBe(false);
  });

  it('rate limit function should be called', async () => {
    const ctx = makeContext({ guild: createFakeGuild(), channel: createFakeTextChannel() });
    const rateLimiter = new RateLimiter({
      limitCount: 1,
      windowMs: 1000,
      customRateLimits: async (userId, guild) => {
        expect(userId).toBe(ctx.userId);
        expect(guild).toBe(ctx.guild);
        return { limitCount: 1, windowMs: 1000 };
      },
    });
    const isRateLimited = await rateLimiter.isRateLimited(ctx);
    expect(isRateLimited).toBe(false);
  });

  it('resetFor should reset the rate limit for the user', async () => {
    const ctx = makeContext({ guild: createFakeGuild(), channel: createFakeTextChannel() });
    const rateLimiter = new RateLimiter({ limitCount: 1, windowMs: 1000 });
    await rateLimiter.isRateLimited(ctx);
    rateLimiter.resetFor(ctx.userId);
    const isRateLimited = await rateLimiter.isRateLimited(ctx);
    expect(isRateLimited).toBe(false);
  });

  it('resetAll should reset the rate limit for all users', async () => {
    const ctx = makeContext({ guild: createFakeGuild(), channel: createFakeTextChannel(), userId: '1' });
    const ctx2 = makeContext({ guild: createFakeGuild(), channel: createFakeTextChannel(), userId: '2' });
    const rateLimiter = new RateLimiter({ limitCount: 1, windowMs: 1000 });
    for (let i = 0; i < 2; i++) {
      await rateLimiter.isRateLimited(ctx);
      await rateLimiter.isRateLimited(ctx2);
    }
    rateLimiter.resetAll();
    const isRateLimited = await rateLimiter.isRateLimited(ctx);
    const isRateLimited2 = await rateLimiter.isRateLimited(ctx2);
    expect(isRateLimited).toBe(false);
    expect(isRateLimited2).toBe(false);
  });
});
