import { describe, it, expect } from 'vitest';
import { splitMessage, DISCORD_MESSAGE_LIMIT } from '@/core/utils/message';

describe('splitMessage', () => {
  it('returns single chunk when under limit', () => {
    const msg = 'hello world';
    const chunks = splitMessage(msg);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(msg);
  });

  it('splits long messages by lines and words', () => {
    const longWord = 'a'.repeat(DISCORD_MESSAGE_LIMIT + 10);
    const msg = `first line\n${longWord}\nlast line`;
    const chunks = splitMessage(msg);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks.join('').replaceAll('\n', '').length).toBe(msg.replaceAll('\n', '').length);
  });
});
