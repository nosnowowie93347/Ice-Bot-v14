const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const PlayStore = require("google-play-scraper");

//By Legendary Emoji | :D

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playstore")
    .setDescription(
      "Show Playstore Application Information Of Your Given Name!",
    )
    .addStringOption((option) =>
      option
        .setName("application")
        .setRequired(true)
        .setDescription("name of app"),
    ),
  async execute(interaction) {
    const appname = interaction.options.getString("application");
    if (!appname) {
      return interaction.reply(`Please Give Something To Search`);
    }
    try {
      PlayStore.search({
        term: appname + " ",
        num: 1,
      }).then((Data) => {
        let App;

        try {
          App = JSON.parse(JSON.stringify(Data[0]));
        } catch (error) {
          return interaction.reply(`No Application Found!`);
        }

        let Embed = new EmbedBuilder()
          .setColor("#008000")
          .setAuthor({
            url: `https://www.youtube.com/channel/UCedJSNoIo2GM8daA8WlldBQ`,
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag,
          })
          .setThumbnail(App.icon)
          .setURL(App.url)
          .setTitle(`${App.title}`)
          .setDescription(App.summary)
          .addFields(
            { name: "price", value: `${App.price}`, inline: true },
            { name: "Developer", value: `${App.developer}`, inline: true },
            { name: "Score", value: `${App.scoreText}`, inline: true },
          )
          .setFooter({
            iconURL: interaction.client.user.displayAvatarURL(),
            text: `Requested By ${interaction.user.username}`,
          })
          .setTimestamp();

        return interaction.reply({ embeds: [Embed] });
      });
    } catch (err) {
      interaction.reply("Error!");
      console.log(err);
    }
  },
};
