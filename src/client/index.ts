import { Client, Collection, Events, MessageFlags } from 'discord.js';
import { Configuration } from '../config';
import { createMoonlinkManager } from '../moonlink/manager';
import { CustomClient } from '../types/CustomClient';

export const createClient = (): CustomClient => {
  const client = new Client({
    intents: Configuration.intents,
  }) as CustomClient;

  client.commands = new Collection();
  client.manager = createMoonlinkManager(client);

  client.on('raw', (packet) => {
    client.manager.packetUpdate(packet);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = (interaction.client as CustomClient).commands.get(
      interaction.commandName
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  });

  return client;
};
