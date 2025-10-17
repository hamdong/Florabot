import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Node } from 'moonlink.js';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Get the current status of the music player');

export async function execute(
  interaction: ChatInputCommandInteraction,
  node: Node
): Promise<void> {
  const status = await node.getNodeStatus();

  const healthy =
    status.connected &&
    status.health.responding &&
    (status.health.status !== 'overloaded' ||
      status.health.performance === 'excellent');

  const embed = new EmbedBuilder()
    .setTitle('My Status')
    .setDescription(node.connected ? '🟢 Connected' : '🔴 Disconnected')
    .addFields(
      { name: 'CPU', value: `${status.stats.cpu.toFixed(2)}%`, inline: true },
      {
        name: 'Memory',
        value: `${(status.stats.memory / 1024 / 1024).toFixed(2)} MB`,
        inline: true,
      },
      { name: 'Health', value: status.health.status, inline: true },
      {
        name: 'Needs Restart',
        value: status.health.needsRestart ? '⚠️ Recommended' : '✅ No',
        inline: true,
      },
      {
        name: 'Responding',
        value: `${status.health.responding}`,
        inline: true,
      },
      {
        name: 'Performance',
        value: status.health.performance,
        inline: true,
      }
    )
    .setColor('#0099ff')
    .setFooter({
      text: healthy ? 'All systems are a go!' : "I don't feel so good...",
    });
  await interaction.reply({ embeds: [embed] });
}
