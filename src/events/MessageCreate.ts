import { Message } from 'discord.js';
import { QuoteService } from '../services/QuoteService';

export class MessageCreate {
  private quoteService: QuoteService;

  constructor() {
    this.quoteService = new QuoteService();
  }

  async handle(message: Message): Promise<void> {
    if (message.author.bot) return;

    const mentionedUsers = message.mentions.users;

    if (
      mentionedUsers.size === 1 &&
      mentionedUsers.first()?.id === message.client.user?.id
    ) {
      const quote = this.quoteService.getRandomQuote();
      await message.reply(`${quote}`);
    }
  }
}
