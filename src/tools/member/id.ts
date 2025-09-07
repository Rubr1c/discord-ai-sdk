import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

export function getUserIdTool(guild: Guild): Tool {
  return tool({
    description: 'fetch user id from username',
    inputSchema: z.object({
      username: z.string().describe('username of tagert'),
    }),
    execute: async ({ username }): Promise<ToolResult> => {
      try {
        const q = username.trim();

        const idMatch = q.match(/^<@!?(\d{17,20})>$|^(\d{17,20})$/);
        if (idMatch) {
          const id = idMatch[1] ?? idMatch[2]!;
          const member = await guild.members.fetch(id);
          return { summary: `${member.user.username}: ${member.id}`, data: { id: member.id } };
        }

        const lower = q.toLowerCase();
        const memberFromCache = guild.members.cache.find(
          (m) =>
            m.user.username.toLowerCase() === lower ||
            m.displayName.toLowerCase() === lower ||
            (m.user.globalName?.toLowerCase?.() ?? '') === lower,
        );
        if (memberFromCache) {
          return {
            summary: `${memberFromCache.user.username}: ${memberFromCache.id}`,
            data: { id: memberFromCache.id },
          };
        }

        return { summary: `${q}: not found` };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `error: ${message}` };
      }
    },
  });
}
