import type { ToolFactory } from '@/tools/types';
import { getMembersTool } from './fetch';
import { kickMemberTool } from './kick';
import { banMemberTool } from './ban';
import { timeoutMemberTool } from './timeout';

export const memberTools = {
  getMembers: getMembersTool,
  kickMember: kickMemberTool,
  banMember: banMemberTool,
  timeoutMember: timeoutMemberTool,
} satisfies Record<string, ToolFactory>;
