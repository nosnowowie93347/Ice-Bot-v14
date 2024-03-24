const { Client, Interaction, SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");

const weeklyAmount = 5000;

module.exports = {
  cooldown: 604800,
  data: new SlashCommandBuilder()
    .setName("weekly")
    .setDMPermission(false)
    .setDescription("Collect weekly money"),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      user.balance += weeklyAmount;
      await user.save();

      interaction.editReply(
        `${weeklyAmount} was added to your balance. Your new balance is ${user.balance}`,
      );
    } catch (error) {
      console.log(`Error with /weekly: ${error}`);
    }
  },
};
