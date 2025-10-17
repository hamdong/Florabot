import { GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({
  path: resolve(__dirname, '../../.env'),
});

console.log('Loading configuration...');

if (!process.env.DISCORD_TOKEN) {
  console.error('Error: DISCORD_TOKEN is not set in environment variables.');
  process.exit(1);
}

export const Configuration = {
  token: process.env.DISCORD_TOKEN,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
} as const;
