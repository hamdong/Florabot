import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { formatDuration } from '../../services/util';

const MAX_QUEUE_DISPLAY = 10;

export const data = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Show the current music queue');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
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
      }) | \`${formatDuration(player.current.duration)}\``,
    );
  }

  if (player.queue.size > 0) {
    let queueValue = '';

    for (let i = 0; i < Math.min(player.queue.size, MAX_QUEUE_DISPLAY); i++) {
      const track = player.queue.tracks[i];
      const line = `${i + 1}. [${track.title}](${track.url}) | \`${formatDuration(track.duration)}\`\n`;

      // 1024 is the hard limit; 1000 leaves room for the "..." footer
      if (queueValue.length + line.length > 1000) {
        queueValue += '*...limit reached*';
        break;
      }
      queueValue += line;
    }

    embed.addFields({ name: 'Up Next:', value: queueValue });

    if (player.queue.size > MAX_QUEUE_DISPLAY) {
      embed.addFields(
        {
          name: 'Plus',
          value: `${player.queue.size - MAX_QUEUE_DISPLAY} more tracks`,
          inline: true,
        },
        {
          name: 'Total Duration',
          value: `\`${formatDuration(player.queue.duration)}\``,
          inline: true,
        },
      );
    }
  }

  await interaction.reply({ embeds: [embed] });
}
