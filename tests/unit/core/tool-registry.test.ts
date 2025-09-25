import { describe, it } from 'vitest';
import { ToolRegistry } from '@/core/tool-registry';
import { createFakeGuild, createFakeTextChannel } from 'tests/utils/discord';
import { makeContext } from 'tests/utils/context';
import { discordApiTools } from '@/tools/index';
import { SAFETY } from '@/core/types';
import type { ToolFactory } from '@/tools/types';

describe('ToolRegistry', () => {
  it('all tools returning when saftey is high', async () => {
    const channel = createFakeTextChannel({ id: '1', name: 'general' });
    const guild = createFakeGuild({ channel });
    const ctx = makeContext({ guild, channel, content: 'hi' });

    const reg = new ToolRegistry({ tools: discordApiTools });
    const tools = await reg.getAllAvailableTools(ctx);
    expect(Object.keys(tools).length).toBe(Object.keys(discordApiTools).length);
  });

  it('return mid and low tools when saftey is mid', async () => {
    const channel = createFakeTextChannel({ id: '1', name: 'general' });
    const guild = createFakeGuild({ channel });
    const ctx = makeContext({ guild, channel, content: 'hi' });

    const reg = new ToolRegistry({ tools: discordApiTools });
    reg.setSafetyModeCap('mid');
    const tools = await reg.getAllAvailableTools(ctx);

    const currentSafetyLevel = SAFETY['mid'];
    const targetTools: Record<string, ToolFactory> = {};

    for (const [toolName, tool] of Object.entries(discordApiTools)) {
      const toolSafetyLevel = SAFETY[tool.safetyLevel];
      if (toolSafetyLevel <= currentSafetyLevel) {
        targetTools[toolName] = tool;
      }
    }

    expect(Object.keys(tools).length).toBe(Object.keys(targetTools).length);
  });

  it('return low tools when saftey is low', async () => {
    const channel = createFakeTextChannel({ id: '1', name: 'general' });
    const guild = createFakeGuild({ channel });
    const ctx = makeContext({ guild, channel, content: 'hi' });

    const reg = new ToolRegistry({ tools: discordApiTools });
    reg.setSafetyModeCap('low');
    const tools = await reg.getAllAvailableTools(ctx);

    const currentSafetyLevel = SAFETY['low'];
    const targetTools: Record<string, ToolFactory> = {};

    for (const [toolName, tool] of Object.entries(discordApiTools)) {
      const toolSafetyLevel = SAFETY[tool.safetyLevel];
      if (toolSafetyLevel <= currentSafetyLevel) {
        targetTools[toolName] = tool;
      }
    }

    expect(Object.keys(tools).length).toBe(Object.keys(targetTools).length);
  });
});
