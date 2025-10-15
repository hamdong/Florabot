import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { formatDuration } from '../../services/util';

export const data = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Show the current music queue');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient
): Promise<void> {
  const player = client.manager.players.get(interaction.guild!.id);

  if (!player) {
    await interaction.reply('There is nothing playing in this server!');
    return;
  }

  if (!player.current && player.queue.size === 0) {
    await interaction.reply('There are no tracks in the queue!');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('Current Queue')
    .setColor('#0099ff');

  if (player.current) {
    embed.setDescription(
      `**Now Playing:**\n[${player.current.title}](${
        player.current.url
      }) | \`${formatDuration(player.current.duration)}\``
    );
  }

  if (player.queue.size > 0) {
    const tracks = player.queue.tracks.map((track, index) => {
      return `${index + 1}. [${track.title}](${track.url}) | \`${formatDuration(
        track.duration
      )}\``;
    });

    embed.addFields({
      name: 'Up Next:',
      value: tracks.slice(0, 10).join('\n'),
    });

    // If there are more than 10 tracks, add a note
    if (player.queue.size > 10) {
      embed.addFields({
        name: 'And more...',
        value: `${player.queue.size - 10} more tracks in the queue`,
      });
    }
  }

  await interaction.reply({ embeds: [embed] });
}
