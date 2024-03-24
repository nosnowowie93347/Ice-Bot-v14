const {
  Client,
  SlashCommandBuilder,
  Interaction,
  EmbedBuilder,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");

const User = require("../../models/User");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("econleaderboard")
    .setDescription("Get the economy leaderboard"),
  async execute(interaction) {
    await interaction.deferReply();
    let text = "";
    const members = await User.find({guildId: interaction.guild.id }).sort({ balance: -1 }).catch((err) => console.log(err))


    for (let counter = 0; counter < members.length; ++counter) {
      let { userId, balance } = members[counter];
      const value = await interaction.client.users.fetch(userId);
      const member = value.tag;

      text += `${counter + 1}. ${member} | Balance: ${balance} \n`;

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`${interaction.guild.name}'s Economy Leaderboard:`)
        .setImage(interaction.guild.iconURL())
        .setDescription(`\`\`\`${text}\`\`\``)
        .setTimestamp()
        .setFooter({ text: "Economy Leaderboard" });

      interaction.editReply({ embeds: [embed] });
    }
  }
  }