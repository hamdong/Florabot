import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../index';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play a song from YouTube')
  .addStringOption((option) =>
    option.setName('query').setDescription('The song to play').setRequired(true)
  );

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient
): Promise<void> {
  const member = interaction.member;
  if (!member || !('voice' in member)) {
    await interaction.reply('Could not determine your voice state!');
    return;
  }
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) {
    await interaction.reply('You need to be in a voice channel!');
    return;
  }

  const query = interaction.options.getString('query', true);
  const guildId = interaction.guild!.id;

  const player = client.manager.hasPlayer(guildId)
    ? client.manager.getPlayer(guildId)
    : client.manager.createPlayer({
        guildId: guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channelId,
        autoPlay: true,
      });

  player.connect();

  const result = await client.manager.search({
    query,
  });

  if (!result.tracks.length) {
    await interaction.reply('No results found!');
    return;
  }

  player.queue.add(result.tracks[0]);
  if (!player.playing) {
    player.play();
  }

  await interaction.reply(`Added to queue: **${result.tracks[0].title}**`);
}
