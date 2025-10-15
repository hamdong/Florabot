import { Events } from 'discord.js';
import { CustomClient } from '../types/CustomClient';

export const name = Events.ClientReady;
export const once = true;

export async function execute(client: CustomClient): Promise<void> {
  if (!client.user) throw new Error('Client user is null');

  console.log(`Ready! Logged in as ${client.user.tag}`);

  await client.manager.init(client.user.id);
  console.log(`Manager initialized? ${client.manager.initialize}`);
}
