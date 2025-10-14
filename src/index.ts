import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
  TextChannel,
} from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createMoonlinkManager } from './moonlink/manager';
import { Manager } from 'moonlink.js';
import { QuoteService } from './services/QuoteService';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

export interface CustomClient extends Client {
  quoteService: QuoteService;
  commands: Collection<string, any>;
  manager: Manager;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
}) as CustomClient;

client.quoteService = new QuoteService();
client.commands = new Collection();
client.manager = createMoonlinkManager(client);

// REGISTER: Commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.ts'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`[INFO] Loaded command: ${command.data.name}`);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// REGISTER: Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.ts'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on('raw', (packet) => {
  client.manager.packetUpdate(packet);
});

client.manager.on('nodeConnected', (node) =>
  console.log(`Node ${node.host} connected!`)
);

client.manager.on('nodeError', (node, error) =>
  console.error(`Node ${node.host} error:`, error)
);

client.manager.on('trackStart', (player, track) => {
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel) {
    channel.send(`Now playing: **${track.title}**`);
  }
});

client.manager.on('trackEnd', (player, track) => {
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel) {
    channel.send(`Track ended: ${track.title}`);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = (interaction.client as CustomClient).commands.get(
    interaction.commandName
  );

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
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

client.manager.on('queueEnd', (player) => {
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel && channel instanceof TextChannel) {
    channel.send(
      'Queue ended. Disconnecting in 30 seconds if no new tracks are added.'
    );
  }

  // Disconnect after a delay if no new tracks are added
  setTimeout(() => {
    if (!player.playing && player.queue.size === 0) {
      player.destroy();
      if (channel && channel instanceof TextChannel) {
        channel.send('Disconnected due to inactivity.');
      }
    }
  }, 30000); // 30 seconds
});

client.login(process.env.DISCORD_TOKEN);
