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
<<<<<<< HEAD
        .setDescription("name of movie or show")
=======
        .setDescription("name of movie or show"),
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
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
<<<<<<< HEAD
          { name: "Type", value: `${movie.type}` }
=======
          { name: "Type", value: `${movie.type}` },
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
        );
      return interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
      return interaction.reply(
<<<<<<< HEAD
        `Something went wrong. Potential error message: ${err}`
=======
        `Something went wrong. Potential error message: ${err}`,
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
      );
    }
  },
};
