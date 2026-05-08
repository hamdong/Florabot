import { execute } from './pause';
import { getPlayerForExecute } from '../../services/validation';
import { createMocks } from '../../test/test-utils';

jest.mock('../../services/validation');

describe('Pause Command', () => {
  it('should pause and start leave timeout if playing', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    mockPlayer.paused = false;
    (getPlayerForExecute as jest.Mock).mockResolvedValue(mockPlayer);

    await execute(mockInteraction, mockClient);

    expect(mockPlayer.pause).toHaveBeenCalled();
    expect(mockClient.startLeaveTimeout).toHaveBeenCalledWith('guild-123', 2);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Paused'));
  });

  it('should warn if already paused', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    mockPlayer.paused = true;
    (getPlayerForExecute as jest.Mock).mockResolvedValue(mockPlayer);

    await execute(mockInteraction, mockClient);
    expect(mockReply).toHaveBeenCalledWith('The player is already paused!');
  });
});
