import { execute as playNextExec } from './play-next';
import { handlePlay } from '../../handlers/play-handler';
import { createMocks } from '../../test/test-utils';

jest.mock('../../handlers/play-handler');

describe('Play Command Variants', () => {
  it('should call handlePlay with priority for play-next', async () => {
    const { mockInteraction, mockClient } = createMocks();
    await playNextExec(mockInteraction, mockClient);
    expect(handlePlay).toHaveBeenCalledWith(
      mockInteraction,
      mockClient,
      'priority',
    );
  });
});
