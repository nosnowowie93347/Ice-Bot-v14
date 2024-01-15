const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const imdb = require("imdb-api");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imdb")
    .setDescription("get info about a movie/show")
    .addStringOption((option) =>
      option
        .setName("name")
        .setRequired(true)
        .setDescription("name of movie or show")
    ),
  async execute(interaction) {
    let nameofcontent = interaction.options.getString("name");
    if (!nameofcontent) {
      return interaction.reply("Please give the name of movie or series");
    }

    const imob = new imdb.Client({ apiKey: "8be53495" }); //You need to paste you imdb api

    try {
      let movie = await imob.get({ name: nameofcontent + " " });

      let embed = new EmbedBuilder()
        .setTitle(movie.title)
        .setColor("#ff2050")
        .setThumbnail(movie.poster)
        .setDescription(movie.plot)
        .setFooter({ text: `Ratings: ${movie.rating}` })
        .addFields(
          { name: "Country", value: `${movie.country}` },
          { name: "Languages", value: `${movie.languages}` },
          { name: "Type", value: `${movie.type}` }
        );
      return interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
      return interaction.reply(
        `Something went wrong. Potential error message: ${err}`
      );
    }
  },
};
