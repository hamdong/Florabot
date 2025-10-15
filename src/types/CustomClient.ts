import { Client, Collection } from 'discord.js';
import { Manager } from 'moonlink.js';
import { QuoteManager } from './QuoteManager';

export interface CustomClient extends Client {
  quoteManager: QuoteManager;
  commands: Collection<string, any>;
  manager: Manager;
}
