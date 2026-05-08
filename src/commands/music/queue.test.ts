import { execute } from './queue';
import { tryGetPlayer } from '../../services/validation';
import { createMocks } from '../../test/test-utils';

jest.mock('../../services/validation');

describe('Queue Command', () => {
  it('should show empty message if nothing in queue', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    mockPlayer.current = null;
    mockPlayer.queue.size = 0;
    (tryGetPlayer as jest.Mock).mockResolvedValue(mockPlayer);

    await execute(mockInteraction, mockClient);
    expect(mockReply).toHaveBeenCalledWith('There are no tracks in the queue!');
  });

  it('should list tracks in the embed', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    mockPlayer.current = { title: 'Current', uri: 'url', duration: 100 };
    mockPlayer.queue.size = 1;
    mockPlayer.queue.tracks = [{ title: 'Next', uri: 'url2', duration: 200 }];
    (tryGetPlayer as jest.Mock).mockResolvedValue(mockPlayer);

    await execute(mockInteraction, mockClient);
    const lastReply = (mockReply as jest.Mock).mock.calls[0][0];
    expect(lastReply.embeds[0].data.title).toBe('Current Queue');
  });
});
