const client = require("nekos.life");
const { SlashCommandBuilder, EmbedBuilder, Discord } = require("discord.js");
const neko = new client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Give someone a nice slap!")
    .addUserOption((option) =>
<<<<<<< HEAD
      option.setName("user").setRequired(true).setDescription("user to slap")
=======
      option.setName("user").setRequired(true).setDescription("user to slap"),
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");

    async function work() {
      let owo = await neko.slap();

      const slapembed = new EmbedBuilder()
        .setTitle(target.username + " OUCH! You've been slapped!")
        .setDescription(
<<<<<<< HEAD
          target.toString() + " got slapped by " + interaction.user.username
=======
          target.toString() + " got slapped by " + interaction.user.username,
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
        )
        .setImage(owo.url)
        .setColor(`#000000`)
        .setURL(owo.url);

      await interaction.reply({ embeds: [slapembed] });
    }

    work();
  },
};
