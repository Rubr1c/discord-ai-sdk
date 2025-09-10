import type { Guild, GuildMember, APIInteractionGuildMember, GuildBasedChannel } from 'discord.js';
import type { RequestContext } from '@/core/types';

export function makeContext(params: {
  guild: Guild;
  channel: GuildBasedChannel;
  userId?: string;
  content?: string;
  member?: GuildMember | APIInteractionGuildMember | null;
}): RequestContext {
  return {
    guild: params.guild,
    channel: params.channel as GuildBasedChannel,
    userId: params.userId ?? '123456789012345678',
    content: params.content ?? '',
    member: params.member ?? null,
  };
}