export class RateLimiter {
  private limitCount: number;
  private windowMs: number;
  private readonly requestTimestamps = new Map<string, number[]>();

  constructor(limitCount: number, windowMs: number) {
    this.limitCount = limitCount;
    this.windowMs = windowMs;
  }

  public isRateLimited(scopeId: string): boolean {
    const now = Date.now();
    const startWindow = now - this.windowMs;

    const scopeTimestamps = this.requestTimestamps.get(scopeId) ?? [];

    // Clean old timestamps to prevent memory bloat
    const recentTimestamps = scopeTimestamps.filter(
      (timestamp) => timestamp > startWindow
    );

    if (recentTimestamps.length >= this.limitCount) {
      // Update with cleaned timestamps even when rate limited
      this.requestTimestamps.set(scopeId, recentTimestamps);
      return true;
    }

    recentTimestamps.push(now);
    this.requestTimestamps.set(scopeId, recentTimestamps);

    return false;
  }

  public getRemaining(scopeId: string): number {
    const now = Date.now();
    const startWindow = now - this.windowMs;
    const scopeTimestamps = this.requestTimestamps.get(scopeId) ?? [];

    // Clean old timestamps to prevent memory bloat
    const recentTimestamps = scopeTimestamps.filter((t) => t > startWindow);
    this.requestTimestamps.set(scopeId, recentTimestamps);

    return Math.max(0, this.limitCount - recentTimestamps.length);
  }

  public reset(scopeId: string): void {
    this.requestTimestamps.delete(scopeId);
  }
}
