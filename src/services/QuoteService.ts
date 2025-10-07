import { QuoteManager } from '../types/QuoteManager';
import path from 'path';

export class QuoteService implements QuoteManager {
  quotes: string[] = [];
  private readonly quotesFile = path.resolve(__dirname, '../data/quotes.json');

  constructor() {
    this.loadQuotes().catch(console.error);
  }

  async loadQuotes(): Promise<void> {
    try {
      this.quotes = require(this.quotesFile);
    } catch (error) {
      console.error('Error loading quotes:', error);
      this.quotes = [];
    }
  }

  getRandomQuote(): string {
    if (this.quotes.length === 0) {
      return 'No quotes available!';
    }
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }
}
