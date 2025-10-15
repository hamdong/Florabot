import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { CustomClient } from '../../types/CustomClient';

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

  const formatDuration = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours ? `${hours}:` : ''}${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const createProgressBar = (current: number, total: number, length = 15) => {
    const progress = Math.round((current / total) * length);
    return '▬'.repeat(progress) + '❄️' + '▬'.repeat(length - progress);
  };

  const embed = new EmbedBuilder()
    .setTitle('Now Playing')
    .setColor('#0099ff')
    .setDescription(`[${track.title}](${track.url})`)
    .addFields(
      { name: 'Author', value: track.author, inline: true },
      {
        name: 'Requested By',
        value: `<@${track.requestedBy?.toLocaleString()}>`,
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
