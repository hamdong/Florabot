import { createClient } from './client';
import { Configuration } from './config';
import { CustomClient } from './types/CustomClient';
import { loadCommands } from './handlers/command-handler';
import { loadEvents } from './handlers/event-handler';

async function main() {
  try {
    const client: CustomClient = createClient();

    loadCommands(client);
    loadEvents(client);

    client.login(Configuration.token);
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

main();
