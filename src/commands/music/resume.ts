import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { CustomClient } from '../../types/CustomClient';

export const data = new SlashCommandBuilder()
  .setName('resume')
  .setDescription('Resume the currently paused song');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient
): Promise<void> {
  const player = client.manager.players.get(interaction.guild!.id);

  if (!player) {
    await interaction.reply('There is nothing playing in this server!');
    return;
  }

  const member = interaction.member as GuildMember;
  if (member.voice.channel?.id !== player.voiceChannelId) {
    await interaction.reply(
      'You need to be in the same voice channel as me to use this command!'
    );
    return;
  }

  if (!player.paused) {
    await interaction.reply('The player is not paused!');
    return;
  }

  player.resume();

  await interaction.reply('Resumed the player.');
}
