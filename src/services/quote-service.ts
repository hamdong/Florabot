const quotes: string[] = [
  "I'm feeling quite well, today. I'll show everyone what I can do.",
  "I've read up on how to fight, but in practice, I could stand to be better...",
  'I just want to thank you for all your kindness and support.',
  'Do you have anything that needs doing? I am free at the moment.',
  'Who is stronger? My sister or me?',
  'Brace for a chill.',
  'Was I... helpful?',
  'Happy to help!',
  'Service with a smile.',
  'Is this good enough?',
  'Freeze!',
  '*Giggle*',
  'War. War never changes.',
  'Some men just want to watch the world burn.',
  'Just gonna stand there and watch me burn?',
  'Is it hot in here or is it just me?',
  'Feeling a little chilly.',
  'Hello.',
  'Have you seen my lord Corrin anywhere?',
  "My sister and I are quite different aren't we?",
  'ICE to meet you.',
  "I'd love to stay and chat but I've got work to do.",
];

export const getRandomQuote = (): string => {
  if (quotes.length === 0) {
    return 'No quotes available!';
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};
