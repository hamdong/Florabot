import { Events, TextChannel, VoiceState } from 'discord.js';
import { CustomClient } from '../types/CustomClient';

export const name = Events.VoiceStateUpdate;
export const once = false;

export async function execute(
  oldState: VoiceState,
  newState: VoiceState
): Promise<void> {
  const oldChannel = oldState.channel;
  const client = oldState.client as CustomClient;

  if (oldChannel && oldChannel.members.size === 1) {
    const botMember = oldChannel.members.find((m) => m.id === client.user?.id);

    if (!botMember) {
      return;
    }

    const player = client.manager.getPlayer(oldChannel.guild.id);
    if (!player) {
      return;
    }

    player.destroy();

    const channel = client.channels.cache.get(player.textChannelId);
    if (channel && channel instanceof TextChannel) {
      await channel.send(
        'You really... just left me alone? :( Leaving voice channel...'
      );
    }
  }
}
