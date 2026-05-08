import { execute } from './status';
import { ChatInputCommandInteraction } from 'discord.js';
import { Node } from 'moonlink.js';

describe('Status Command', () => {
  interface MockNode {
    connected: boolean;
    stats: {
      players: number;
      playingPlayers: number;
      uptime: number;
      cpu: { cores: number; systemLoad: number; lavalinkLoad: number };
      memory: { used: number; allocated: number };
    } | null;
  }

  const mockReply = jest.fn();
  const mockInteraction = {
    reply: mockReply,
  } as unknown as ChatInputCommandInteraction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly format and calculate system statistics', async () => {
    const mockNode: MockNode = {
      connected: true,
      stats: {
        players: 10,
        playingPlayers: 5,
        uptime: 60000, // 60 seconds
        cpu: { cores: 4, systemLoad: 0.255, lavalinkLoad: 0.123 },
        memory: {
          used: 524288000, // 500 MB
          allocated: 1048576000, // 1000 MB
        },
      },
    };

    await execute(mockInteraction, mockNode as unknown as Node);

    const replyCall = mockReply.mock.calls[0][0];
    const embed = replyCall.embeds[0].data;

    expect(embed.description).toBe('🟢 Connected');

    const systemLoadField = embed.fields.find(
      (f: any) => f.name === 'System Load',
    );
    expect(systemLoadField.value).toBe('25.50%');

    const memoryField = embed.fields.find((f: any) => f.name === 'Memory Used');
    expect(memoryField.value).toBe('500.00 MB');

    const uptimeField = embed.fields.find((f: any) => f.name === 'Uptime');
    expect(uptimeField.value).toBe('60s');
  });

  it('should display disconnected status and handle null stats safely', async () => {
    const mockNode: MockNode = {
      connected: false,
      stats: null,
    };

    await execute(mockInteraction, mockNode as unknown as Node);

    const replyCall = mockReply.mock.calls[0][0];
    const embed = replyCall.embeds[0].data;

    expect(embed.description).toBe('🔴 Disconnected');

    const playersField = embed.fields.find((f: any) => f.name === 'Players');
    expect(playersField.value).toBe('0');
  });
});
