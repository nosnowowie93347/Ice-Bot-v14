const client = require("nekos.life");
const { SlashCommandBuilder, EmbedBuilder, Discord } = require("discord.js");
const neko = new client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poke")
    .setDescription("poke a mentioned user")
    .addUserOption((option) =>
      option.setName("user").setRequired(true).setDescription("user to poke"),
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    await interaction.deferReply();
    async function work() {
      let owo = await neko.poke();

      const pokeembed = new EmbedBuilder()
        .setTitle(target.username + " You have been poked!")
        .setDescription(target.toString() + " got poked by " + interaction.user)
        .setImage(owo.url)
        .setColor(`#000000`)
        .setURL(owo.url);

      interaction.editReply({ embeds: [pokeembed] });
    }

    work();
  },
};