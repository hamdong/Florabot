import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../../types/CustomClient';
import { handlePlay } from '../../handlers/play-handler';

export const data = new SlashCommandBuilder()
  .setName('play-next')
  .setDescription('Play a song at the front of the queue')
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription('The song to play')
      .setRequired(true)
      .setMaxLength(200),
  );

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: CustomClient,
): Promise<void> {
  await handlePlay(interaction, client, 'priority');
}
