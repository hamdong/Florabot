import { CustomClient } from '..';
import { Player, Track } from 'moonlink.js';
import { TextChannel } from 'discord.js';

export const name = 'trackEnd';
export const once = false;
export const manager = true;

export async function execute(
  player: Player,
  track: Track,
  client: CustomClient
): Promise<void> {
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel) {
    await channel.send(`Track ended: **${track.title}**`);
  }
}
