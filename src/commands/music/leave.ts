import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { tryGetPlayer } from '../../services/validation';

export const data = new SlashCommandBuilder()
  .setName('leave')
  .setDescription('Make the bot leave the voice channel');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<void> {
  const player = await tryGetPlayer(interaction, client);
  if (!player) return;

  await player.destroy();

  await interaction.reply('Left the voice channel!');
}
