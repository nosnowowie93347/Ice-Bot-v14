const client = require("nekos.life");
const { SlashCommandBuilder, EmbedBuilder, Discord } = require("discord.js");
const neko = new client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("Kisses for someone!")
    .addUserOption((option) =>
<<<<<<< HEAD
      option.setName("user").setRequired(true).setDescription("user to kiss")
=======
      option.setName("user").setRequired(true).setDescription("user to kiss"),
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");

    async function work() {
      let owo = await neko.kiss();

      const kissembed = new EmbedBuilder()
        .setTitle(target.username + " You have been kissed!")
        .setDescription(
<<<<<<< HEAD
          target.toString() + " got kissed by " + interaction.user
=======
          target.toString() + " got kissed by " + interaction.user,
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
        )
        .setImage(owo.url)
        .setColor(`#000000`)
        .setURL(owo.url);

      await interaction.reply({ embeds: [kissembed] });
    }

    work();
  },
};
