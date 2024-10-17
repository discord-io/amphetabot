import { REST, Routes } from 'discord.js';
import fs from 'fs-extra';
import path from 'node:path';
const {
  SRC_PATH,
  BOT_APP_ID_AMPHETABOT: clientId,
  GUILD_ID: guildId = false,
  BOT_TOKEN_AMPHETABOT: token,
} = process.env;


const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.resolve(SRC_PATH, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { default: command } = await import(filePath);
    console.log('Loaded command: ' + command.data.name);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    let data;

    if (guildId) {
      // The put method is used to fully refresh all commands in the guild with the current set
      data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
    } else {
      data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );
    }




    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();