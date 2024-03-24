const { EmbedBuilder, SlashCommandBuilder } = module.require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hentai")
    .setDescription("hentaaaaaaai")
    .setNSFW(true),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      var errMessage = "This is not an NSFW Channel";

      const res = await fetch(`https://nekobot.xyz/api/image?type=hentai`);
      const img = (await res.json()).message;
      await interaction.editReply({
        files: [{ attachment: img, name: "trumptweet.png" }],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
