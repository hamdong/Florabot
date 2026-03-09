import { Player, Track } from 'moonlink.js';
import { TextChannel } from 'discord.js';
import { CustomClient } from '../types/CustomClient';
import { TrackEndReason } from 'moonlink.js/dist/src/typings/types';

export const name = 'trackEnd';
export const once = false;
export const manager = true;

export async function execute(
  player: Player,
  track: Track,
  reason: TrackEndReason,
  payload: any,
  client: CustomClient,
): Promise<void> {
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel && reason !== 'replaced') {
    await channel.send(`Track ended: **${track.title}** Reason: **${reason}**`);
  }
}
