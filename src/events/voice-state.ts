import { Events, TextChannel, VoiceState } from 'discord.js';
import { CustomClient } from '../types/CustomClient';

export const name = Events.VoiceStateUpdate;
export const once = false;

export async function execute(
  oldState: VoiceState,
  newState: VoiceState,
): Promise<void> {
  const oldChannel = oldState.channel;
  const client = oldState.client as CustomClient;

  if (oldState.member?.id === client.user?.id) return;

  if (oldChannel && oldChannel.members.size === 1) {
    const player = client.manager.players.get(oldChannel.guild.id);
    if (!player || player.voiceChannelId !== oldChannel.id) return;

    const savedTextChannelId = player.textChannelId;

    await player.destroy();

    if (savedTextChannelId) {
      const channel = client.channels.cache.get(savedTextChannelId);
      if (channel && channel instanceof TextChannel) {
        await channel.send('Happy to be of service! Leaving voice channel...');
      }
    }
  }
}
