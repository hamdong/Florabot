import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { formatDuration } from '../../services/util';

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

  const createProgressBar = (current: number, total: number, length = 15) => {
    const progress = Math.round((current / total) * length);
    return '▬'.repeat(progress) + '❄️' + '▬'.repeat(length - progress);
  };

  const embed = new EmbedBuilder()
    .setTitle(`[${track.title}](${track.url})`)
    .setColor('#0099ffff')
    .setFooter({ text: `${track.sourceName}` })
    .addFields(
      { name: 'Uploader', value: track.author, inline: true },
      {
        name: 'Requested By',
        value: `<@${track.requestedBy}>`,
        inline: true,
      },
      {
        name: 'Duration',
        value: `\`${formatDuration(track.position)} / ${formatDuration(
          track.duration
        )}\`\n${createProgressBar(track.position, track.duration)}`,
        inline: false,
      }
    );

  if (track.artworkUrl) {
    embed.setThumbnail(track.artworkUrl);
  }

  await interaction.reply({ embeds: [embed] });
}
