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

  client.leaveTimeouts = new Map();

  client.resetLeaveTimeout = (guildId: string) => {
    const timeout = client.leaveTimeouts.get(guildId);
    if (timeout) {
      clearTimeout(timeout);
      client.leaveTimeouts.delete(guildId);
    }
  };

  client.startLeaveTimeout = (guildId: string, minutes: number) => {
    // Always clear existing before starting a new one
    client.resetLeaveTimeout(guildId);

    const timeout = setTimeout(
      async () => {
        const player = client.manager.players.get(guildId);
        if (player) {
          await player.destroy();
        }
        client.leaveTimeouts.delete(guildId);
      },
      minutes * 60 * 1000,
    );

    client.leaveTimeouts.set(guildId, timeout);
  };

  // client.manager.on('debug', (msg) => console.log(`[Moonlink] ${msg}`));

  client.on('raw', (packet) => {
    client.manager.packetUpdate(packet);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;
    const command = (interaction.client as CustomClient).commands.get(
      interaction.commandName,
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    commandCounter.inc({ command_name: commandName });
    // Start timer for latency tracking
    const end = commandLatencyHistogram.startTimer({
      command_name: commandName,
    });

    try {
      const node = client.manager.nodes.findNode();

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
