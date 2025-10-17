import { join } from 'path';
import { readdirSync, Dirent } from 'fs';
import { CustomClient } from '../types/CustomClient';
import { BaseCommand } from '../types/BaseCommand';

const loadCommandsFromDirectory = (dir: string, client: CustomClient): void => {
  const entries: Dirent[] = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      loadCommandsFromDirectory(fullPath, client);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))
    ) {
      try {
        const command: BaseCommand = require(fullPath);

        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
          console.log(`[INFO] Loaded command: ${command.data.name}`);
        } else {
          console.warn(
            `[WARNING] Command at ${fullPath} is missing required "data" or "execute" property.`
          );
        }
      } catch (err) {
        console.error(`❌ Failed to load command at ${fullPath}:`, err);
      }
    }
  }
};

export const loadCommands = (client: CustomClient): void => {
  const rootPath = join(__dirname, '../commands');
  loadCommandsFromDirectory(rootPath, client);
};
