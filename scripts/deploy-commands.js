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

const foldersPath = path.join(__dirname, '../dist/commands'); // <- Use compiled JS
const commandFolders = fs.readdirSync(foldersPath);

(async () => {
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js')); // <- Only read .js now

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);

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
        console.error(`Failed to load command at ${filePath}:`, err);
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
