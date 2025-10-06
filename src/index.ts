import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
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

// Use clientReady instead of ready
client.on('clientReady', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
