import { tool, type Tool } from 'ai';
import { type Guild, type FetchMembersOptions } from 'discord.js';
import z from 'zod';

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
    execute: async ({ limit, query, withPresences }) => {
      try {
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
          roles: member.roles.cache.size - 1,
          status: withPresences ? member.presence?.status || 'offline' : undefined,
        }));

        if (members.length === 0) {
          return query
            ? `No members found matching query "${query}"`
            : `[ERROR] Bot probably does not have the GatewayIntentBits.GuildMembers intent`;
        }

        const memberList = members
          .map((mem) => {
            const botTag = mem.bot ? '[BOT] ' : '';
            const statusTag = mem.status ? ` [${mem.status.toUpperCase()}]` : '';
            const roleCount = mem.roles > 0 ? ` (${mem.roles} roles)` : '';
            return `${botTag}${mem.displayName} (@${mem.username}) (ID: ${mem.id})${statusTag}${roleCount}`;
          })
          .join('\n');

        return `Found ${members.length} members${query ? ` matching "${query}"` : ''}:\n${memberList}`;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return `Failed to fetch members: ${errorMsg}`;
      }
    },
  });
}
