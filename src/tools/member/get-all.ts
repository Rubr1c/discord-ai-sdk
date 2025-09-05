import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';

export function getMembersTool(guild: Guild): Tool {
  return tool({
    description: 'get a list of members',
    inputSchema: z.object(),
    execute: async () => {
      const members = (await guild.members.fetch()).map(({ user }) => ({
        bot: user.bot,
        username: user.username,
        id: user.id,
      }));

      if (members.length == 0) {
        return `[ERROR] Bot problably does not have the GatewayIntentBits.GuildMember intent`;
      }

      return `Found ${members.length} members:\n${members
        .map((mem) => `${mem.bot ? '[BOT] ' : ''}${mem.username} (ID: ${mem.id})`)
        .join('\n')}`;
    },
  });
}
