import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { createPlayerEmbed } from '../../services/util';
import { tryGetPlayer } from '../../services/validation';

export const data = new SlashCommandBuilder()
  .setName('now-playing')
  .setDescription('Show information about the currently playing song');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<void> {
  const player = await tryGetPlayer(interaction, client);
  if (!player) return;

  if (!player.current) {
    await interaction.reply('Nothing is playing!');
    return;
  }

  const track = player.current;
  const embed = createPlayerEmbed(track);

  await interaction.reply({ embeds: [embed] });
}
