import path from 'node:path';
import fs from 'fs-extra';
import { Client, Collection, GatewayIntentBits, PresenceUpdateStatus } from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits;
const { BOT_PREFIX = ">", BOT_TOKEN_AMPHETABOT, SRC_PATH } = process.env;

const client = new Client({
  intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
  presence: PresenceUpdateStatus.DoNotDisturb
});

client.commands = new Collection();
client.DEFAULT_PREFIX = BOT_PREFIX;
client.token = BOT_TOKEN_AMPHETABOT;

const foldersPath = path.resolve(SRC_PATH, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { default: command } = await import(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`Successfully loaded command: ${command.data.name}`);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const eventsPath = path.resolve(SRC_PATH, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const { default: event } = await import(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

export default client;

