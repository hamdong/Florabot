import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { getPlayerForExecute } from '../../services/validation';

export const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop the music');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<void> {
  const guildId = interaction.guild!.id;
  const player = await getPlayerForExecute(interaction, client);
  if (!player) return;

  await player.stop();

  client.startLeaveTimeout(guildId, 5);

  await interaction.reply(
    'Stopped playback. I will leave the channel in 5 minutes if no new tracks are added.',
  );
}
