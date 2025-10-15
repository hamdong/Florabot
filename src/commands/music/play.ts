import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../types/CustomClient';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play a song from YouTube')
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription('The song to play')
      .setRequired(true)
      .setMaxLength(200)
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
      });

  player.connect();

  const result = await client.manager.search({
    query,
    requester: interaction.user.id,
  });

  if (!result.tracks.length) {
    await interaction.reply('No results found!');
    return;
  }

  switch (result.loadType) {
    case 'playlist':
      player.queue.add(result.tracks);

      interaction.reply({
        content: `Added playlist **${result.playlistInfo.name}** with ${result.tracks.length} tracks to the queue.`,
      });

      if (!player.playing) {
        player.play();
      }
      break;

    case 'search':
    case 'track':
      player.queue.add(result.tracks[0]);

      interaction.reply({
        content: `Added **${result.tracks[0].title}** to the queue.`,
      });

      if (!player.playing) {
        player.play();
      }
      break;

    case 'empty':
      interaction.reply('No matches found for your query!');
      break;

    case 'error':
      interaction.reply(
        `An error occurred while loading the track: ${
          result.error || 'Unknown error'
        }`
      );
      break;
  }
}
