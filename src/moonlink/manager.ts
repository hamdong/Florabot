import dotenv from 'dotenv';
import { Client } from 'discord.js';
import { Manager } from 'moonlink.js';

dotenv.config();

export const createMoonlinkManager = (client: Client<boolean>) => {
  return new Manager({
    nodes: [
      {
        host: 'lavalink',
        port: 2333,
        password: process.env.LAVA_PASSWORD || 'youshallnotpass',
        secure: false,
      },
    ],
    options: { autoResume: true },
    sendPayload: (guildId: string, payload: string) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(JSON.parse(payload));
    },
  });
};
