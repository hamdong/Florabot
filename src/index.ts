import path from 'path';
import fs from 'fs';
import { createClient } from './client';
import { Configuration } from './config';
import { CustomClient } from './types/CustomClient';

async function main() {
  try {
    const client: CustomClient = createClient();

    // await Promise.all([loadCommands(client), loadEvents(client)]);

    // REGISTER: Commands
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.ts'));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
          console.log(`[INFO] Loaded command: ${command.data.name}`);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      }
    }

    // REGISTER: Events
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith('.ts'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      if (event.once) {
        event.manager
          ? client.manager.once(event.name, (...args: any) =>
              event.execute(...args, client)
            )
          : client.once(event.name, (...args) => event.execute(...args));
        console.log(`[INFO] Loaded event: ${event.name} (once)`);
      } else {
        event.manager
          ? client.manager.on(event.name, (...args: any) =>
              event.execute(...args, client)
            )
          : client.on(event.name, (...args) => event.execute(...args));
        console.log(`[INFO] Loaded event: ${event.name}`);
      }
    }

    client.login(Configuration.token);
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

main();
