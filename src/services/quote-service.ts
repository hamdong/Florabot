import { QuoteManager } from '../types/QuoteManager';
import path from 'path';

export const createQuoteManager = (): QuoteManager => {
  const quotesFile = path.resolve(__dirname, '../data/quotes.json');
  let quotes: string[] = [];

  const loadQuotes = async (): Promise<void> => {
    try {
      quotes = require(quotesFile);
    } catch (error) {
      console.error('Error loading quotes:', error);
      quotes = [];
    }
  };

  const getRandomQuote = (): string => {
    if (quotes.length === 0) {
      return 'No quotes available!';
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  // Load quotes immediately
  loadQuotes().catch(console.error);

  return {
    quotes,
    loadQuotes,
    getRandomQuote,
  };
};
