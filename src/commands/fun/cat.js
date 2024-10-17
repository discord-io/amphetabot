import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { randomCat } from '#data/cats.js';

export default {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Gets a random cat pic'),

  // run the command
  async execute(interaction) {
    const cat = randomCat();

    const embed = new EmbedBuilder()
      .setAuthor({ name: cat.name })
      .setDescription("Tags: " + cat.tags.join(' | '))
      .setImage(cat.url)
      .setFooter({
        text: "Cat ID: " + cat._id,
      });

    await interaction.reply({ embeds: [embed] });

  },
};
