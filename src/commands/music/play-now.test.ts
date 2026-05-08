import { execute as playNowExec } from './play-now';
import { handlePlay } from '../../handlers/play-handler';
import { createMocks } from '../../test/test-utils';

jest.mock('../../handlers/play-handler');

describe('Play Command Variants', () => {
  it('should call handlePlay with now for play-now', async () => {
    const { mockInteraction, mockClient } = createMocks();
    await playNowExec(mockInteraction, mockClient);
    expect(handlePlay).toHaveBeenCalledWith(mockInteraction, mockClient, 'now');
  });
});
