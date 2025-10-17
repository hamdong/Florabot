const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];
const commandsPath = path.join(__dirname, '../dist/commands');

/**
 * Loads a single command module and pushes its data to the commands array.
 */
async function loadCommand(filePath) {
  try {
    const commandModule = await import(pathToFileURL(filePath).href);
    const command = commandModule.default || commandModule;

    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  } catch (err) {
    console.error(`❌ Failed to load command at ${filePath}:`, err);
  }
}

/**
 * Loads all commands from a directory, including subfolders.
 */
async function loadCommandsFromDirectory(basePath) {
  const entries = fs.readdirSync(basePath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      await loadCommandsFromDirectory(entryPath); // recursively handle nested folders
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      await loadCommand(entryPath);
    }
  }
}

/**
 * Registers the loaded commands with Discord via the REST API.
 */
async function deployCommands() {
  await loadCommandsFromDirectory(commandsPath);

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log(`🔄 Refreshing ${commands.length} application (/) commands...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `✅ Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error('❌ Error reloading commands:', error);
  }
}

deployCommands();
