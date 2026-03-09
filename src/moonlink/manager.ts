import dotenv from 'dotenv';
import { Client } from 'discord.js';
import { Manager } from 'moonlink.js';

dotenv.config();

export const createMoonlinkManager = (client: Client<boolean>) => {
  return new Manager({
    nodes: [
      {
        identifier: 'main',
        host: 'lavalink',
        port: 2333,
        password: process.env.LAVA_PASSWORD || 'youshallnotpass',
        secure: false,
        priority: 1,
      },
    ],
    options: {
      clientName: 'Florabot',
      node: {
        selectionStrategy: 'leastLoad',
        avoidUnhealthyNodes: true,
        maxCpuLoad: 80,
        maxMemoryUsage: 0.9,
        autoMovePlayers: true,
        retryAmount: 10,
        retryDelay: 5000,
      },
      defaultPlayer: {
        autoPlay: true,
        selfDeaf: true,
      },
    },
    send: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },
  });
};
