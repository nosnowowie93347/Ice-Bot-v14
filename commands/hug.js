const client = require("nekos.life");
const { SlashCommandBuilder, EmbedBuilder, Discord } = require("discord.js");
const neko = new client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("hugs a mentioned user")
    .addUserOption((option) =>
      option.setName("user").setRequired(true).setDescription("user to hug")
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");

    async function work() {
      let owo = await neko.hug();

      const hugembed = new EmbedBuilder()
        .setTitle(target.username + " You have been hugged!")
        .setDescription(
          target.toString() + " got hugged by " + interaction.user
        )
        .setImage(owo.url)
        .setColor(`#000000`)
        .setURL(owo.url);

      await interaction.reply({ embeds: [hugembed] });
    }

    work();
  },
};
