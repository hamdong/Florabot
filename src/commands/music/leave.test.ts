import { execute as leaveExec } from './leave';
import { tryGetPlayer } from '../../services/validation';
import { createMocks } from '../../test/test-utils';

jest.mock('../../services/validation');

describe('Music Commands: Simple Actions', () => {
  it('should make the bot leave', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    (tryGetPlayer as jest.Mock).mockResolvedValue(mockPlayer);

    await leaveExec(mockInteraction, mockClient);
    expect(mockPlayer.destroy).toHaveBeenCalled();
    expect(mockReply).toHaveBeenCalledWith('Left the voice channel!');
  });
});
