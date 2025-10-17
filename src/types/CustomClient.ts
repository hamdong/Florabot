import { Client, Collection } from 'discord.js';
import { Manager } from 'moonlink.js';

export interface CustomClient extends Client {
  commands: Collection<string, any>;
  manager: Manager;
}
