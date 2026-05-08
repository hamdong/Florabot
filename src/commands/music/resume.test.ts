import { execute } from './resume';
import { getPlayerForExecute } from '../../services/validation';
import { createMocks } from '../../test/test-utils';

jest.mock('../../services/validation');

describe('Resume Command', () => {
  it('should resume and reset timeout if paused', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    mockPlayer.paused = true;
    (getPlayerForExecute as jest.Mock).mockResolvedValue(mockPlayer);

    await execute(mockInteraction, mockClient);

    expect(mockPlayer.resume).toHaveBeenCalled();
    expect(mockClient.resetLeaveTimeout).toHaveBeenCalledWith('guild-123');
    expect(mockReply).toHaveBeenCalledWith('Resumed the player.');
  });

  it('should warn if not paused', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    mockPlayer.paused = false;
    (getPlayerForExecute as jest.Mock).mockResolvedValue(mockPlayer);

    await execute(mockInteraction, mockClient);
    expect(mockReply).toHaveBeenCalledWith('The player is not paused!');
  });
});
