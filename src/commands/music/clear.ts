import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { getPlayerForExecute } from '../../services/validation';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear the music queue');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<void> {
  const player = await getPlayerForExecute(interaction, client);
  if (!player) return;

  player.queue.clear();

  await interaction.reply('Cleared the queue.');
}
