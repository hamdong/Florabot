import { TextChannel } from 'discord.js';
import { Player, Track } from 'moonlink.js';
import { CustomClient } from '../types/CustomClient';

export const name = 'trackException';
export const once = false;
export const manager = true;

export async function execute(
  player: Player,
  track: Track,
  exception: Error,
  client: CustomClient
): Promise<void> {
  console.log(`Error in track ${track.title}:`, exception);
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel) {
    await channel.send(
      `An error occurred while playing the track: **${track.title}**`
    );
  }
}
