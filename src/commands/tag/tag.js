import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tag')
    .setDescription('Work with tags')
    .addSubcommand(subcommand => 
      subcommand
        .setName('list')
        .setDescription('List existing tags')

    ).addSubcommand()
    
    ,
  async execute(interaction) {
    await interaction.reply(`Ping: ${client.ws.ping}ms.`);
  },
};