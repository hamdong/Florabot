import { EmbedBuilder } from 'discord.js';
import { Track } from 'moonlink.js';

interface RequestedBy {
  id: string;
}

const createProgressBar = (current: number, total: number, length = 15) => {
  const progress = Math.round((current / total) * length);
  return '▬'.repeat(progress) + '❄️' + '▬'.repeat(length - progress);
};

export const formatDuration = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return `${hours ? `${hours}:` : ''}${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const createPlayerEmbed = (track: Track) => {
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

  return embed;
};
