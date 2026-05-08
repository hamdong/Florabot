import { execute } from './stop';
import { getPlayerForExecute } from '../../services/validation';
import { createMocks } from '../../test/test-utils';

jest.mock('../../services/validation');

describe('Stop Command', () => {
  it('should stop and start a 5 minute timeout', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    (getPlayerForExecute as jest.Mock).mockResolvedValue(mockPlayer);

    await execute(mockInteraction, mockClient);

    expect(mockPlayer.stop).toHaveBeenCalled();
    expect(mockClient.startLeaveTimeout).toHaveBeenCalledWith('guild-123', 5);
    expect(mockReply).toHaveBeenCalledWith(
      expect.stringContaining('5 minutes'),
    );
  });
});
