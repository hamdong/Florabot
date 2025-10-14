import { Client } from 'discord.js';
import { Manager } from 'moonlink.js';

export const createMoonlinkManager = (client: Client<boolean>) => {
  return new Manager({
    nodes: [
      {
        host: 'localhost',
        port: 2333,
        password: 'youshallnotpass',
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
