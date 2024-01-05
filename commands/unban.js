const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
  .setName("unban")
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .setDescription("Unban a previously banned user")
  .addStringOption(option => option
    .setName("userid")
    .setRequired(true)
    .setDescription("id of user to unban")
    ),
  async execute(interaction) {

    const userId = interaction.options.getString("userid");
    
    try {
      await interaction.guild.members.unban(userId);
      await interaction.reply(
        `User ${userId} was unbanned.`
      );
    } catch (error) {
      console.log(`There was an error when unbanning: ${error}`);
    }
  }
}