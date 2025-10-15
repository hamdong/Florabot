import { join } from 'path';
import { readdirSync } from 'fs';
import { CustomClient } from '../types/CustomClient';

export const loadCommands = (client: CustomClient): void => {
  const foldersPath = join(__dirname, '../commands');
  const commandFolders = readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter((file) =>
      file.endsWith('.ts')
    );

    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      const command = require(filePath);

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
};
