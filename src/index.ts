import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import { MessageCreate } from './events/MessageCreate';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

const messageHandler = new MessageCreate();

client.on('clientReady', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
  await messageHandler.handle(message);
});

client.login(process.env.DISCORD_TOKEN);
