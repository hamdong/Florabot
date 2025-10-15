import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { formatDuration } from '../../services/util';

interface RequestedBy {
  id: string;
}

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
    .setTitle(`${track.title}`)
    .setURL(`${track.url}`)
    .setAuthor({
      name: track.author ?? 'Now Playing',
    })
    .setColor('#0099ff')
    .setFooter({ text: `${track.sourceName}` })
    .addFields(
      {
        name: 'Duration',
        value: `\`${formatDuration(track.position)} / ${formatDuration(
          track.duration
        )}\`\n${createProgressBar(track.position, track.duration)}`,
        inline: true,
      },
      {
        name: 'Requested By',
        value: track.requestedBy
          ? `<@${(track.requestedBy as RequestedBy).id}>`
          : `N/A`,
        inline: true,
      }
    );

  if (track.artworkUrl) {
    embed.setThumbnail(track.artworkUrl);
  }

  await interaction.reply({ embeds: [embed] });
}
