import { ChatInputCommandInteraction } from 'discord.js';
import { CustomClient } from '../types/CustomClient';

export const createMocks = () => {
  const mockReply = jest.fn();

  const mockPlayer = {
    destroy: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    stop: jest.fn(),
    skip: jest.fn(),
    paused: false,
    current: null as any,
    queue: {
      clear: jest.fn(),
      size: 0,
      tracks: [] as any[],
    },
  };

  const mockInteraction = {
    guild: { id: 'guild-123' },
    reply: mockReply,
  } as unknown as ChatInputCommandInteraction;

  const mockClient = {
    startLeaveTimeout: jest.fn(),
    resetLeaveTimeout: jest.fn(),
  } as unknown as CustomClient;

  return { mockReply, mockPlayer, mockInteraction, mockClient };
};
