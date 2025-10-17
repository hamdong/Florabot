import { ChatInputCommandInteraction } from 'discord.js';
import { CustomClient } from './CustomClient';
import { Node } from 'moonlink.js';

export interface BaseCommand {
  data: any;
  execute: (
    interaction: ChatInputCommandInteraction,
    client?: CustomClient,
    node?: Node
  ) => Promise<void>;
}
