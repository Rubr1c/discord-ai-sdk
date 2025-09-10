// tests/utils/discord.ts
import { ChannelType, type Guild, type GuildBasedChannel } from 'discord.js';

interface FakeTextChannel {
  id: string;
  name: string;
  type: ChannelType.GuildText;
  parent: { id: string; name: string } | null;
  position: number;
  isTextBased: () => true;
  send: (content: string) => Promise<{ id: string; url: string }>;
  messages: {
    fetch: (
      _opts?: unknown,
    ) => Promise<
      Map<string, { id: string; author: { username: string }; content: string; createdAt: Date }>
    >;
  };
  edit: (opts: {
    name?: string;
    parent?: string | null;
    position?: number;
  }) => Promise<FakeTextChannel>;
  delete: (_reason?: string) => Promise<string>;
}

export function createFakeTextChannel(init?: Partial<FakeTextChannel>): GuildBasedChannel {
  const self: FakeTextChannel = {
    id: init?.id ?? '1000',
    name: init?.name ?? 'general',
    type: ChannelType.GuildText,
    parent: init?.parent ?? null,
    position: init?.position ?? 0,
    isTextBased: () => true,
    send: async () => ({ id: 'm1', url: `https://discord.com/channel/1` }),
    messages: { fetch: async () => new Map() },
    edit: async (opts) =>
      Object.assign(self, {
        name: opts.name ?? self.name,
        parent:
          'parent' in opts ? (opts.parent ? { id: opts.parent, name: 'cat' } : null) : self.parent,
        position: opts.position ?? self.position,
      }),
    delete: async () => 'deleted',
  };
  return self as unknown as GuildBasedChannel;
}

export function createFakeGuild(channels: Record<string, GuildBasedChannel> = {}): Guild {
  const channelMap = new Map(Object.entries(channels).map(([id, ch]) => [id, ch]));
  const guildLike = {
    id: 'g1',
    name: 'Test Guild',
    channels: {
      fetch: async (id?: string) => (id ? (channelMap.get(id) ?? null) : new Map(channelMap)),
      create: async ({
        name,
        parent,
      }: {
        name: string;
        type: ChannelType;
        parent?: string | null;
      }) => {
        const ch = createFakeTextChannel({
          id: String(channelMap.size + 1),
          name,
          parent: parent ? { id: parent, name: 'cat' } : null,
        });
        channelMap.set(ch.id, ch);
        return ch;
      },
    },
  };
  return guildLike as unknown as Guild;
}
