import { execute as playExec } from './play';
import { handlePlay } from '../../handlers/play-handler';
import { createMocks } from '../../test/test-utils';

jest.mock('../../handlers/play-handler');

describe('Play Command Variants', () => {
  it('should call handlePlay normally for play', async () => {
    const { mockInteraction, mockClient } = createMocks();
    await playExec(mockInteraction, mockClient);
    expect(handlePlay).toHaveBeenCalledWith(mockInteraction, mockClient);
  });
});
