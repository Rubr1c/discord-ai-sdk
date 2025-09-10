import { describe, it, expect } from 'vitest';
import { AIEngine } from '@/core/ai-engine';
import { PromptBuilder } from '@/core/prompt-builder';
import { ToolRegistry } from '@/core/tool-registry';
import type { LanguageModel } from 'ai';
import { makeContext } from 'tests/utils/context';
import { createFakeGuild, createFakeTextChannel } from 'tests/utils/discord';

vi.mock('ai', async () => {
  // Provide stubs for generateText and stepCountIs used by AIEngine
  return {
    generateText: vi.fn(),
    stepCountIs: () => () => true,
  } as unknown as typeof import('ai');
});

const { generateText } = await import('ai');

function makeEngineWithMockedModel() {
  const model = {} as unknown as LanguageModel;
  return new AIEngine({
    model,
    promptBuilder: new PromptBuilder(),
    toolRegistry: new ToolRegistry(),
  });
}

describe('AIEngine', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('handle returns model text when present', async () => {
    (generateText as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      text: 'hello',
      toolResults: [],
    });

    const engine = makeEngineWithMockedModel();
    const ctx = makeContext({ guild: createFakeGuild(), channel: createFakeTextChannel() });
    const res = await engine.handle('hi', ctx);
    expect(res).toBe('hello');
  });

  it('postProcess summarizes tool results when no text', async () => {
    (generateText as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      text: '',
      toolResults: [
        { toolName: 'sendMessage', result: { summary: 'Sent message' } },
        { toolName: 'getRoles', output: { summary: 'Found 2 roles' } },
      ],
    });

    const engine = makeEngineWithMockedModel();
    const ctx = makeContext({ guild: createFakeGuild(), channel: createFakeTextChannel() });
    const res = await engine.handle('tell me roles', ctx);
    expect(res).toContain('sendMessage');
    expect(res).toContain('Sent message');
    expect(res).toContain('getRoles');
    expect(res).toContain('Found 2 roles');
  });

  it('callModel wires prompts and tools into generateText', async () => {
    (generateText as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ text: 'ok' });
    const engine = makeEngineWithMockedModel();
    const ctx = makeContext({ guild: createFakeGuild(), channel: createFakeTextChannel() });
    await engine.callModel('x', ctx);

    expect(generateText).toHaveBeenCalledTimes(1);
    const call = (generateText as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0];
    expect(call).toBeDefined();
    expect(call).toHaveProperty('prompt');
    expect(call).toHaveProperty('system');
    expect(call).toHaveProperty('tools');

    expect(typeof call.tools).toBe('object');
  });
});
