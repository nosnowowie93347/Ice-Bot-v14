const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('stealemoji')
  .setDescription("steal an emoji from another server")
  .addStringOption(option => option.setName('emoji').setDescription('the emoji to steal').setRequired(true)),
  async execute (interaction) {
  const rawEmoji = interaction.options.getString('emoji');
  const parsedEmoji = Discord.parseEmoji(rawEmoji);
  if (parsedEmoji.id) {
    const extension = parsedEmoji.animated ? ".gif" : ".png";
    const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
    
   await interaction.guild.emojis.create({ attachment: url, name: parsedEmoji.name })
    const embed = new EmbedBuilder()
    .setTitle(`Your emoji has been stolen!`)
    .addFields({ name: "Emoji Name", value: `${parsedEmoji.name} `})
    .addFields({ name: `Emoji ID`, value: `${parsedEmoji.id} `})
    .setTimestamp()
    .setColor("Blue")
    .setFooter({ text: `Emoji Stealing Tool` })

    await interaction.reply({ embeds: [embed] }).catch(err => {})
  }
}
}