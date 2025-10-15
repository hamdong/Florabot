import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { createPlayerEmbed } from '../../services/util';

export const data = new SlashCommandBuilder()
  .setName('now-playing')
  .setDescription('Show information about the currently playing song');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient
): Promise<void> {
  const player = client.manager.players.get(interaction.guild!.id);

  if (!player) {
    await interaction.reply('There is nothing playing in this server!');
    return;
  }

  if (!player.current) {
    await interaction.reply('Nothing is playing!');
    return;
  }

  const track = player.current;
  const embed = createPlayerEmbed(track);

  await interaction.reply({ embeds: [embed] });
}
