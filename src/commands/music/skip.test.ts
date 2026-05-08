import { execute } from './skip';
import { getPlayerForExecute } from '../../services/validation';
import { createMocks } from '../../test/test-utils';

jest.mock('../../services/validation');

describe('Skip Command', () => {
  it('should skip and name the song if playing', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    mockPlayer.current = { title: 'Test Track' };
    (getPlayerForExecute as jest.Mock).mockResolvedValue(mockPlayer);

    await execute(mockInteraction, mockClient);

    expect(mockPlayer.skip).toHaveBeenCalled();
    expect(mockReply).toHaveBeenCalledWith(
      expect.stringContaining('Test Track'),
    );
  });
});
