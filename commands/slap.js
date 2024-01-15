const client = require("nekos.life");
const { SlashCommandBuilder, EmbedBuilder, Discord } = require("discord.js");
const neko = new client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Give someone a nice slap!")
    .addUserOption((option) =>
      option.setName("user").setRequired(true).setDescription("user to slap")
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");

    async function work() {
      let owo = await neko.slap();

      const slapembed = new EmbedBuilder()
        .setTitle(target.username + " OUCH! You've been slapped!")
        .setDescription(
          target.toString() + " got slapped by " + interaction.user.username
        )
        .setImage(owo.url)
        .setColor(`#000000`)
        .setURL(owo.url);

      await interaction.reply({ embeds: [slapembed] });
    }

    work();
  },
};
