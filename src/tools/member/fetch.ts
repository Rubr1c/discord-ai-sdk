import { tool, type Tool } from 'ai';
import { type Guild, type FetchMembersOptions } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

/**
 * Creates a tool to fetch members.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function getMembersTool(guild: Guild): Tool {
  return tool({
    description: 'get a list of members with optional filtering and limits',
    inputSchema: z.object({
      limit: z
        .number()
        .int()
        .min(1)
        .max(1000)
        .default(100)
        .describe('number of members to fetch (1-1000)'),
      query: z
        .string()
        .optional()
        .describe('search members by username (case-insensitive partial match)'),
      withPresences: z
        .boolean()
        .default(false)
        .describe('include member presence information (online status, activities)'),
    }),
    execute: async ({ limit, query, withPresences }): Promise<ToolResult> => {
      const fetchOptions: FetchMembersOptions = {
        limit,
        withPresences,
      };

      if (query) {
        fetchOptions.query = query;
      }

      const fetchedMembers = await guild.members.fetch(fetchOptions);

      const members = Array.from(fetchedMembers.values()).map((member) => ({
        bot: member.user.bot,
        username: member.user.username,
        displayName: member.displayName,
        id: member.user.id,
        joinedAt: member.joinedAt?.toISOString() || null,
        roles: Math.max(0, member.roles.cache.size - 1),
        status: withPresences ? member.presence?.status || 'offline' : undefined,
      }));

      return {
        summary: `Found ${members.length} members${query ? ` matching "${query}"` : ''}`,
        data: members,
      };
    },
  });
}
