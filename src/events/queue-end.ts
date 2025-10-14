import { CustomClient } from '..';
import { Player } from 'moonlink.js';
import { TextChannel } from 'discord.js';

export const name = 'queueEnd';
export const once = false;
export const manager = true;

export async function execute(
  player: Player,
  client: CustomClient
): Promise<void> {
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel) {
    await channel.send(
      'Queue ended. Disconnecting in 30 seconds if no new tracks are added.'
    );

    // Disconnect after a delay if no new tracks are added
    setTimeout(() => {
      if (!player.playing && player.queue.size === 0) {
        player.destroy();
        channel.send('Disconnected due to inactivity.');
      }
    }, 30000); // 30 seconds
  }
}
