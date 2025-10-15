import { Player, Track, TTrackEndType } from 'moonlink.js';
import { TextChannel } from 'discord.js';
import { CustomClient } from '../types/CustomClient';

export const name = 'trackEnd';
export const once = false;
export const manager = true;

export async function execute(
  player: Player,
  track: Track,
  type: TTrackEndType,
  payload: any,
  client: CustomClient
): Promise<void> {
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel && type !== 'replaced') {
    await channel.send(`Track ended: **${track.title}** Reason: **${type}**`);
  }
}
