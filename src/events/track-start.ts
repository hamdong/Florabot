import { TextChannel } from 'discord.js';
import { CustomClient } from '..';
import { Player, Track } from 'moonlink.js';

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
