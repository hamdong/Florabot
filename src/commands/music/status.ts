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
  node: Node,
): Promise<void> {
  const stats = node.stats;

  const embed = new EmbedBuilder()
    .setTitle('My Status')
    .setDescription(node.connected ? '🟢 Connected' : '🔴 Disconnected')
    .addFields(
      { name: 'Players', value: `${stats?.players ?? 0}`, inline: true },
      { name: 'Playing', value: `${stats?.playingPlayers ?? 0}`, inline: true },
      {
        name: 'Uptime',
        value: `${Math.floor((stats?.uptime ?? 0) / 1000)}s`,
        inline: true,
      },
      { name: 'CPU Cores', value: `${stats?.cpu.cores ?? 0}`, inline: true },
      {
        name: 'System Load',
        value: `${((stats?.cpu.systemLoad ?? 0) * 100).toFixed(2)}%`,
        inline: true,
      },
      {
        name: 'Lavalink Load',
        value: `${((stats?.cpu.lavalinkLoad ?? 0) * 100).toFixed(2)}%`,
        inline: true,
      },
      {
        name: 'Memory Used',
        value: `${((stats?.memory.used ?? 0) / 1048576).toFixed(2)} MB`,
        inline: true,
      },
      {
        name: 'Memory Allocated',
        value: `${((stats?.memory.allocated ?? 0) / 1048576).toFixed(2)} MB`,
        inline: true,
      },
    )
    .setColor('#0099ff');
  await interaction.reply({ embeds: [embed] });
}
