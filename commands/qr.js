const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("qr")
    .setDescription("Generate a qr code")
    .addStringOption((option) =>
      option
        .setName("text")
        .setRequired(true)
        .setDescription("text to convert"),
    ),
  async execute(interaction) {
    let text = interaction.options.getString("text");
    if (text.length < 2) {
      interaction.reply(
        "You must add text to your command, so I can convert it to a QR code.\nEg: `.qr This message is now encoded as a QR code` ",
      );
    } else {
      var user_text = text.replace(/ /g, "%20");

      var qr_generator = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user_text}`;
      console.log(qr_generator);
      const embed = new EmbedBuilder()
        .setTitle("QR Code")
        .setColor("#3440eb")
        .setDescription("Here is your QR Code!")
        .setImage(qr_generator + ".png");
      interaction.reply({ embeds: [embed] });
    }
    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  },
};
