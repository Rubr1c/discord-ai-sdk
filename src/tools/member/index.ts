import type { ToolFactory } from '@/tools/types';
import { getMembersTool } from './fetch';
import { kickMemberTool } from './kick';
import { banMemberTool } from './ban';
import { unbanMemberTool } from './unban';
import { timeoutMemberTool } from './timeout';
import { untimeoutMemberTool } from './untimeout';

export const memberTools = {
  getMembers: getMembersTool,
  kickMember: kickMemberTool,
  banMember: banMemberTool,
  unbanMember: unbanMemberTool,
  timeoutMember: timeoutMemberTool,
  untimeoutMember: untimeoutMemberTool,
} satisfies Record<string, ToolFactory>;
