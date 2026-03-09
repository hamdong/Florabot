import { ChatInputCommandInteraction } from 'discord.js';
import { CustomClient } from '../types/CustomClient';
import { addTracksToQueue } from '../services/queue-service';

type PlayMode = 'normal' | 'priority' | 'now';

export async function handlePlay(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
  mode: PlayMode = 'normal',
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

  const player = client.manager.players.create({
    guildId,
    voiceChannelId: voiceChannel.id,
    textChannelId: interaction.channelId,
  });

  await player.connect();

  const result = await client.manager.search({
    query,
    requester: interaction.member?.user.id,
  });

  if (!result.tracks.length) {
    await interaction.reply('No results found!');
    return;
  }

  const isPriority = mode === 'priority' || mode === 'now';
  const locationText =
    mode === 'now'
      ? 'play immediately'
      : mode === 'priority'
        ? 'the front of the queue'
        : 'the queue';

  switch (result.loadType) {
    case 'empty':
      return void interaction.reply('No matches found for your query!');

    case 'error':
      return void interaction.reply(
        `An error occurred while loading the track: ${
          result.error || 'Unknown error'
        }`,
      );

    case 'playlist':
      addTracksToQueue(player.queue, result.tracks, { priority: isPriority });

      await interaction.reply({
        content: `Added playlist **${result.playlistInfo.name}** with ${result.tracks.length} tracks to ${locationText}.`,
      });
      break;

    case 'search':
    case 'track':
      addTracksToQueue(player.queue, result.tracks[0], {
        priority: isPriority,
      });

      await interaction.reply({
        content: `Added **${result.tracks[0].title}** to ${locationText}.`,
      });
      break;
  }

  if (mode === 'now' && player.playing) {
    await player.skip();
  } else if (!player.playing) {
    await player.play();
  }
}
