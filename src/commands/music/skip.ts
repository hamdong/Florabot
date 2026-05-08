import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { getPlayerForExecute } from '../../services/validation';

export const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip the currently playing song');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<void> {
  const player = await getPlayerForExecute(interaction, client);
  if (!player) return;

  if (!player.current) {
    await interaction.reply('There is nothing playing right now!');
    return;
  }

  const currentTrack = player.current;
  await player.skip();

  await interaction.reply(`Skipped: **${currentTrack.title}**`);
}
