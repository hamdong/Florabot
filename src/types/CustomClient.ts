import { Client, Collection } from 'discord.js';
import { QuoteService } from '../services/QuoteService';
import { Manager } from 'moonlink.js';

export interface CustomClient extends Client {
  quoteService: QuoteService;
  commands: Collection<string, any>;
  manager: Manager;
}
