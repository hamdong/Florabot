import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { getPlayerForExecute } from '../../services/validation';

export const data = new SlashCommandBuilder()
  .setName('resume')
  .setDescription('Resume the currently paused song');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<void> {
  const guildId = interaction.guild!.id;
  const player = await getPlayerForExecute(interaction, client);
  if (!player) return;

  if (!player.paused) {
    await interaction.reply('The player is not paused!');
    return;
  }

  client.resetLeaveTimeout(guildId);

  await player.resume();

  await interaction.reply('Resumed the player.');
}
