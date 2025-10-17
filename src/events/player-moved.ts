import { Player } from 'moonlink.js';
import { TextChannel } from 'discord.js';
import { CustomClient } from '../types/CustomClient';

export const name = 'playerMoved';
export const once = false;
export const manager = true;

export async function execute(
  player: Player,
  oldChannel: string,
  newChannel: string,
  client: CustomClient
): Promise<void> {
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel) {
    await channel.send('Player moved to a new voice channel.');
  }
}
