const client = require("nekos.life");
const { SlashCommandBuilder, EmbedBuilder, Discord } = require("discord.js");
const neko = new client();

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("hugs a mentioned user")
    .addUserOption((option) =>
      option.setName("user").setRequired(true).setDescription("user to hug"),
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    await interaction.deferReply();
    async function work() {
      let owo = await neko.sfw.hug();

      const hugembed = new EmbedBuilder()
        .setTitle(target.username + " You have been hugged!")
        .setDescription(
          target.toString() + " got hugged by " + interaction.user.username,
        )
        .setImage(owo.url)
        .setColor(`#000000`)
        .setURL(owo.url);

      interaction.editReply({ embeds: [hugembed] });
    }

    work();
  },
};
