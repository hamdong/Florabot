import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { CustomClient } from '../types/CustomClient';

export const data = new SlashCommandBuilder()
  .setName('about')
  .setDescription('Get information about the bot');

export async function execute(
  interaction: ChatInputCommandInteraction,
  _client: CustomClient
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle('About Me')
    .setDescription('Hello! I am Florabot. Here is some information about me:')
    .addFields(
      { name: 'Developer', value: 'Ham', inline: true },
      { name: 'Library', value: 'discord.js', inline: true },
      { name: 'Player Engine', value: 'moonlink.js', inline: true },
      { name: 'Version', value: '1.0.0', inline: true }
    )
    .setColor('#0099ff')
    .setFooter({ text: 'Service with a smile :)' });

  await interaction.reply({ embeds: [embed] });
}
