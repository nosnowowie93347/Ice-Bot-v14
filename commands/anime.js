//LETS GET STARTED
const { get } = require("request-promise-native");
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
  .setName('anime')
  .setDescription("Get anime information")
  .addStringOption(option => option
    .setName("animename")
    .setRequired(true)
    .setDescription("name of anime")
    ),
  async execute(interaction) {
    
    const nameofanime = interaction.options.getString("animename");
    
    if(!nameofanime) {
      return interaction.reply("Please Give Anime Name")
    }
    //DEFINE OPTIONS
    
    let option = {
      url: `https://kitsu.io/api/edge/anime?filter[text]=${nameofanime}`,
      method: `GET`,
      headers: {
        'Content-Type': "application/vnd.api+json",
        'Accept': "application/vnd.api+json"

      },
      json: true
    }
    
    
    interaction.reply("Fetching The Info").then(msg => {
      get(option).then(body => {
       try {
        let embed = new EmbedBuilder()
        .setTitle(body.data[0].attributes.slug)
        .setColor("#ff2050")
        .setDescription(body.data[0].attributes.synopsis)
        .setThumbnail(body.data[0].attributes.posterImage.original)
        .addFields(
          { name: "Ratings", value: `${body.data[0].attributes.averageRating}` },
          { name: "TOTAL EPISODES: ", value: `${body.data[0].attributes.episodeCount}` }
        )
        .setImage(body.data[0].attributes.coverImage.large)
        
        
        
        interaction.editReply({embeds: [embed]})
        
       } catch (err) {
        console.log(err)
        return interaction.editReply("Unable to find this anime");

       }
        
        
        
      }                 
                       
    )})
    
  }

}