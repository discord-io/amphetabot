import { MessageCollector, SlashCommandBuilder } from "discord.js";
import { Paste } from "#util/pastebin.js";

export default {
  data: new SlashCommandBuilder()
    .setName('savelog')
    .setDescription('Save recent messages in the specified channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to save the logs for')
        .setRequired(true)
    ).addNumberOption(option =>
      option.setName('limit')
        .setDescription('How many messages to save, defaults to 25')

    ).addStringOption(option =>
      option.setName('format')
        .setDescription('Save format, defaults to MD [COMING SOON TM]')
        .addChoices({
          name: 'text', value: 'txt',
          // name: 'csv', value: 'csv',
          // name: 'json', value: 'json',
          // name: 'html', value: 'html',
          name: 'markdown', value: 'md'
        })
    ).addUserOption(option =>
      option.setName('user').setDescription('Filter messages to a particular user [COMING SOON TM]')
    ).addBooleanOption(option =>
      option.setName('ephemeral').setDescription('Makes the command output only visible to you')
    )
  ,

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

    await interaction.deferReply({ ephemeral });

    const channel = interaction.options.getChannel('channel');
    const limit = interaction.options.getNumber('limit') ?? 25;
    const format = interaction.options.getString('format') ?? 'md';
    const user = interaction.options.getUser('user');

    const messages = await channel.messages.fetch({ limit: limit });

    const paste = await Paste.fromMessageList({
      messages: Array.from(messages.reverse().values()), data: {
        channelName: channel.name,
        channelId: channel.id
      }
    });

    const { url, admin, isPrivate } = paste;

    const mdUrl = url.replace('https://zaza.ovh', 'https://zaza.ovh/a');
    await interaction.editReply({ ephemeral, content: `Markdown URL: <${mdUrl}>` });

  }
};
