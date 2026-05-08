import {
  ChatInputCommandInteraction,
  GuildMember,
  VoiceBasedChannel,
} from 'discord.js';
import { Player } from 'moonlink.js';
import { CustomClient } from '../types/CustomClient';

export async function validateUserInVoiceChannel(
  interaction: ChatInputCommandInteraction,
): Promise<VoiceBasedChannel | null> {
  const member = interaction.member;
  if (!member || !('voice' in member)) {
    await interaction.reply('Could not determine your voice state!');
    return null;
  }

  const voiceChannel = member.voice.channel;
  if (!voiceChannel) {
    await interaction.reply(
      'You need to be in a voice channel to use this command!',
    );
    return null;
  }

  return voiceChannel;
}

export async function tryGetPlayer(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<Player | null> {
  const player = client.manager.players.get(interaction.guild!.id);

  if (!player) {
    await interaction.reply('There is nothing playing in this server!');
    return null;
  }

  return player;
}

export async function validateUserInSameChannel(
  interaction: ChatInputCommandInteraction,
  player: Player,
): Promise<boolean> {
  const member = interaction.member as GuildMember;
  const userChannelId = member.voice.channel?.id;

  if (!userChannelId || userChannelId !== player.voiceChannelId) {
    await interaction.reply(
      'You need to be in the same voice channel as me to use this command!',
    );
    return false;
  }

  return true;
}

export async function getPlayerForExecute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<Player | null> {
  const voiceChannel = await validateUserInVoiceChannel(interaction);
  if (!voiceChannel) return null;

  const player = await tryGetPlayer(interaction, client);
  if (!player) return null;

  const isValidChannel = await validateUserInSameChannel(interaction, player);
  if (!isValidChannel) return null;

  return player;
}
