import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { CustomClient } from '../../types/CustomClient';

export const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop the music');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<void> {
  const guildId = interaction.guild!.id;
  const player = client.manager.players.get(guildId);

  if (!player) {
    await interaction.reply('There is nothing playing in this server!');
    return;
  }

  const member = interaction.member as GuildMember;
  if (member.voice.channel?.id !== player.voiceChannelId) {
    await interaction.reply(
      'You need to be in the same voice channel as me to use this command!',
    );
    return;
  }

  await player.stop();

  client.startLeaveTimeout(guildId, 5);

  await interaction.reply(
    'Stopped playback. I will leave the channel in 5 minutes if no new tracks are added.',
  );
}
