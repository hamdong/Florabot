import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../index';

export const data = new SlashCommandBuilder()
  .setName('leave')
  .setDescription('Make the bot leave the voice channel');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient
): Promise<void> {
  const player = client.manager.getPlayer(interaction.guild!.id);

  if (!player) {
    await interaction.reply("I'm not playing anything in this server!");
  }

  player.destroy();
  await interaction.reply('Left the voice channel!');
}
