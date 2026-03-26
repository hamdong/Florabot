import { Client, Collection } from 'discord.js';
import { Manager } from 'moonlink.js';

export interface CustomClient extends Client {
  commands: Collection<string, any>;
  manager: Manager;
  leaveTimeouts: Map<string, NodeJS.Timeout>;
  resetLeaveTimeout: (guildId: string) => void;
  startLeaveTimeout: (guildId: string, minutes: number) => void;
}
