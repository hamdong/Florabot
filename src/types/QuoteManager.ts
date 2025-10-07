export interface QuoteManager {
  quotes: string[];
  loadQuotes(): Promise<void>;
  getRandomQuote(): string;
}
