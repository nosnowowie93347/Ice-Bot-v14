const client = require("nekos.life");
const { SlashCommandBuilder, EmbedBuilder, Discord } = require("discord.js");
const neko = new client();

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("Kisses for someone!")
    .addUserOption((option) =>
      option.setName("user").setRequired(true).setDescription("user to kiss"),
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    await interaction.deferReply();
    async function work() {
      let owo = await neko.kiss();

      const kissembed = new EmbedBuilder()
        .setTitle(target.username + " You have been kissed!")
        .setDescription(
          target.toString() + " got kissed by " + interaction.user,
        )
        .setImage(owo.url)
        .setColor(`#000000`)
        .setURL(owo.url);

      interaction.editReply({ embeds: [kissembed] });
    }

    work();
  },
};
