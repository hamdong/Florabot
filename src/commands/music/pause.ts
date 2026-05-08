import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { getPlayerForExecute } from '../../services/validation';

export const data = new SlashCommandBuilder()
  .setName('pause')
  .setDescription('Pause the currently playing song');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<void> {
  const guildId = interaction.guild!.id;
  const player = await getPlayerForExecute(interaction, client);
  if (!player) return;

  if (player.paused) {
    await interaction.reply('The player is already paused!');
    return;
  }

  await player.pause();

  client.startLeaveTimeout(guildId, 2);

  await interaction.reply(
    'Paused the player. I will leave the channel in 2 minutes if not resumed.',
  );
}
