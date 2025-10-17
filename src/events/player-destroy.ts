import { Player } from 'moonlink.js';
import { TextChannel } from 'discord.js';
import { CustomClient } from '../types/CustomClient';

export const name = 'playerDestroy';
export const once = false;
export const manager = true;

export async function execute(
  player: Player,
  client: CustomClient
): Promise<void> {
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel) {
    await channel.send(
      'Player has been destroyed and resources have been cleaned up.'
    );
  }
}
