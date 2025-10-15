import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { CustomClient } from '../../types/CustomClient';

export const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip the currently playing song');

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient
): Promise<void> {
  const player = client.manager.players.get(interaction.guild!.id);

  if (!player) {
    await interaction.reply('There is nothing playing in this server!');
    return;
  }

  const member = interaction.member as GuildMember;
  if (member.voice.channel?.id !== player.voiceChannelId) {
    await interaction.reply(
      'You need to be in the same voice channel as me to use this command!'
    );
    return;
  }

  if (!player.current) {
    await interaction.reply('There is nothing playing right now!');
    return;
  }

  const currentTrack = player.current;
  player.skip();

  await interaction.reply(`Skipped: **${currentTrack.title}**`);
}
