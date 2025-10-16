import { Events, Message } from 'discord.js';
import { getRandomQuote } from '../services/quote-service';

export const name = Events.MessageCreate;
export const once = false;

export async function execute(message: Message): Promise<void> {
  if (message.author.bot || !message.guild) return;

  const mentionedUsers = message.mentions.users;

  if (
    mentionedUsers.size === 1 &&
    mentionedUsers.first()?.id === message.client.user?.id
  ) {
    const quote = getRandomQuote();
    await message.reply(`${quote}`);
  }
}
