import { createClient } from './client';
import { Configuration } from './config';
import { CustomClient } from './types/CustomClient';
import { loadCommands } from './handlers/command-handler';
import { loadEvents } from './handlers/event-handler';
import { startMetricsServer } from './metrics';

async function main() {
  try {
    console.log('Starting bot...');
    const client: CustomClient = createClient();

    console.log('Loading commands and events...');
    loadCommands(client);
    loadEvents(client);

    console.log('Starting metrics server...');
    startMetricsServer();

    console.log('Logging in...');
    await client.login(Configuration.token);
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

main();
