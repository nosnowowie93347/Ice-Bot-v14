const Discord = require('discord.js')
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("pussy")
  .setDescription("A hot pussy"),
  async execute(interaction){
//command
let response = [
"https://github.com/Swag666baby/nsfw-api/blob/master/media/hentai/vanila/0.jpg?raw=true", "https://github.com/Swag666baby/nsfw-api/blob/master/media/hentai/vanila/13.jpg?raw=true", "https://github.com/Swag666baby/nsfw-api/blob/master/media/hentai/vanila/1.jpg?raw=true", "https://github.com/Swag666baby/nsfw-api/blob/master/media/hentai/vanila/10.jpg?raw=true", "https://github.com/Swag666baby/nsfw-api/blob/master/media/hentai/vanila/14.jpg?raw=true", "https://github.com/Swag666baby/nsfw-api/blob/master/media/hentai/vanila/15.jpg?raw=true", "https://github.com/Swag666baby/nsfw-api/blob/master/media/hentai/vanila/3.jpg?raw=true", "https://us.rule34.xxx//images/7814/2e3c0864562d3226391456d9d213b78c.png?8922784", "https://us.rule34.xxx//images/2181/bcca7c9c6a5f8551ff1f5bae1dcf3fba.jpeg?9252441", "https://us.rule34.xxx//images/7949/f2bbba0cf212ade64fb3f5543c2bba0b.png?9087546", "https://us.rule34.xxx/thumbnails/5421/thumbnail_bcbd27093b3ac105159869b9620a56fe.jpg?9181755"]
var randomNumber = response[Math.floor(Math.random()*response.length)];
  const lewdembed = new EmbedBuilder()
  .setTitle("Pussy")
  .setImage(randomNumber)
  .setColor(`#000000`)
  .setURL(randomNumber);
interaction.reply({embeds: [lewdembed]});
}
};