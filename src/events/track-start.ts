import { TextChannel } from 'discord.js';
import { Player, Track } from 'moonlink.js';
import { CustomClient } from '../types/CustomClient';

export const name = 'trackStart';
export const once = false;
export const manager = true;

export async function execute(
  player: Player,
  track: Track,
  client: CustomClient
): Promise<void> {
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel) {
    await channel.send(`Track started: **${track.title}**`);
  }
}
