const { get } = require("request-promise-native");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
module.exports = {
  data: new SlashCommandBuilder()
  .setName("pokemon")
  .setDescription("Pokemon")
  .addStringOption((option) =>
      option
        .setName("pokemon")
        .setRequired(true)
        .setDescription("id of user to unban"),
    ),

  async execute(interaction) {

const ppokemon = interaction.options.getString("pokemon")
const options = {
  url: `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?pokemon=${ppokemon}`,
  json: true
  
}

interaction.reply("Fetching Informtion for API").then(msg => {
  get(options).then(body => {
    
    let embed = new EmbedBuilder()
    .addFields({ name: body.name, value: `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${body.images.typeIcon}`})
    .setDescription(body.info.description)
    .setImage(`https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${body.images.photo}`)
    .setColor("#ff2050")
    interaction.editReply({ embeds: [embed] })

  })
})



}
}