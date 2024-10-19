#!/usr/bin/env node
import repl from 'node:repl';
import client from "#client";
import { initRepl } from './commands/repl.js';
import { program } from "commander";

client.on('messageCreate', async message => {
  if (message.author.bot) return;
});

client.once('ready', async readyClient => {
  console.log(`Logged in as ${readyClient.user.username}`);
});

// -- CLI definitions below --
program.name('amphetabot')
  .description('Multi purpose Discord bot')
  .version('0.1.0');


program.command('start', { isDefault: true })
  .description('starts the bot')
  .action(function () {
    client.login(client.token);
  });

program.command('repl')
  .description('starts an interactive repl with the client')
  .action(initRepl);


program.parse();
