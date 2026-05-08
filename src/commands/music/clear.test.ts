import { execute as clearExec } from './clear';
import { getPlayerForExecute, tryGetPlayer } from '../../services/validation';
import { createMocks } from '../../test/test-utils';

jest.mock('../../services/validation');

describe('Music Commands: Simple Actions', () => {
  it('should clear the queue', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    (getPlayerForExecute as jest.Mock).mockResolvedValue(mockPlayer);

    await clearExec(mockInteraction, mockClient);
    expect(mockPlayer.queue.clear).toHaveBeenCalled();
    expect(mockReply).toHaveBeenCalledWith('Cleared the queue.');
  });
});
