const client = require("nekos.life");
const { SlashCommandBuilder, EmbedBuilder, Discord } = require("discord.js");
const neko = new client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("hugs a mentioned user")
    .addUserOption((option) =>
<<<<<<< HEAD
      option.setName("user").setRequired(true).setDescription("user to hug")
=======
      option.setName("user").setRequired(true).setDescription("user to hug"),
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");

    async function work() {
      let owo = await neko.hug();

      const hugembed = new EmbedBuilder()
        .setTitle(target.username + " You have been hugged!")
        .setDescription(
<<<<<<< HEAD
          target.toString() + " got hugged by " + interaction.user
=======
          target.toString() + " got hugged by " + interaction.user,
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
        )
        .setImage(owo.url)
        .setColor(`#000000`)
        .setURL(owo.url);

      await interaction.reply({ embeds: [hugembed] });
    }

    work();
  },
};
