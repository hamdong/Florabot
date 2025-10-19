import {
  Client,
  Collection,
  Events,
  InteractionReplyOptions,
  MessageFlags,
} from 'discord.js';
import { Configuration } from '../config';
import { createMoonlinkManager } from '../moonlink/manager';
import { CustomClient } from '../types/CustomClient';
import {
  commandCounter,
  commandErrorCounter,
  commandLatencyHistogram,
} from '../metrics/collectors';

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

    const commandName = interaction.commandName;
    const command = (interaction.client as CustomClient).commands.get(
      interaction.commandName
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    commandCounter.inc({ command_name: commandName });
    // Start timer for latency tracking
    const end = commandLatencyHistogram.startTimer({
      command_name: commandName,
    });

    try {
      const node = client.manager.nodes.get('default');

      // Special-case commands that need node
      const nodeOnlyCommands = new Set(['status']);

      if (nodeOnlyCommands.has(interaction.commandName)) {
        await command.execute(interaction, node);
      } else {
        await command.execute(interaction, client);
      }
    } catch (error) {
      // Increment error count
      commandErrorCounter.inc({ command_name: commandName });

      console.error(error);

      const replyOptions: InteractionReplyOptions = {
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(replyOptions);
      } else {
        await interaction.reply(replyOptions);
      }
    } finally {
      // Stop timer and record duration
      end();
    }
  });

  return client;
};
