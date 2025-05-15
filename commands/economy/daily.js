const { Client, Interaction, SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");

const dailyAmount = 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDMPermission(false)
    .setDescription("Collect dailies"),

  async execute(interaction) {
    // try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            "You have already collected your dailies today. Come back tomorrow!",
          );
          return;
        }

        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(
        `${dailyAmount} was added to your balance. Your new balance is ${user.balance}`,
      );
    // } catch (error) {
    //   console.log(`Error with /daily: ${error}`);
    // }
  },
};
