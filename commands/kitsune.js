const Discord = module.require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const NSFW = require("discord-nsfw");
const nsfw = new NSFW();

module.exports = {
  data: new SlashCommandBuilder().setName("kitsune").setDescription("h"),
  async execute(interaction) {
    await interaction.deferReply();
    var errMessage = "This is not an NSFW Channel";

    const image = await nsfw.kitsune();
    const embed = new Discord.EmbedBuilder()
      .setTitle(`Kitsune`)
      .setColor("Green")
      .setImage(image);
    interaction.editReply({ embeds: [embed] });
  },
};
