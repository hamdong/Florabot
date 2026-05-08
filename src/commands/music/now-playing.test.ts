import { execute } from './now-playing';
import { tryGetPlayer } from '../../services/validation';
import { createPlayerEmbed } from '../../services/util';
import { createMocks } from '../../test/test-utils';

jest.mock('../../services/validation');
jest.mock('../../services/util');

describe('Now Playing Command', () => {
  it('should show embed if song is playing', async () => {
    const { mockInteraction, mockClient, mockPlayer, mockReply } =
      createMocks();
    mockPlayer.current = { title: 'Test Song', uri: 'url', duration: 1000 };
    (tryGetPlayer as jest.Mock).mockResolvedValue(mockPlayer);
    (createPlayerEmbed as jest.Mock).mockReturnValue({ title: 'Mock Embed' });

    await execute(mockInteraction, mockClient);
    expect(mockReply).toHaveBeenCalledWith({
      embeds: [{ title: 'Mock Embed' }],
    });
  });
});
