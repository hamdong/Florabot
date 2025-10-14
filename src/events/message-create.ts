import { Events, Message } from 'discord.js';
import { CustomClient } from '..';

export const name = Events.MessageCreate;
export const once = false;

export async function execute(message: Message): Promise<void> {
  if (message.author.bot || !message.guild) return;

  const mentionedUsers = message.mentions.users;

  if (
    mentionedUsers.size === 1 &&
    mentionedUsers.first()?.id === message.client.user?.id
  ) {
    const client = message.client as CustomClient;
    const quote = client.quoteService.getRandomQuote();
    await message.reply(`${quote}`);
  }
}
