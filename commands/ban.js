const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription("Ban anyone with one shot xD")
    .addUserOption((option) =>
      option.setName("user").setRequired(true).setDescription("user to ban")
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setRequired(true)
        .setDescription("Why are you muting this person?")
    ),
  async execute(interaction) {
    const targetUserId = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    await interaction.deferReply();
    const targetUser = await interaction.guild.members.fetch(targetUserId);
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "You can't ban that user because they're the server owner."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't ban that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't ban that user because they have the same/higher role than me."
      );
      return;
    }

    // Ban the targetUser
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `User ${targetUser} was banned\nReason: ${reason}`
      );
    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
    }
  },
};
