const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const clientId = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setRequired(true).setDescription("user to kick")
    )
    .setDescription("Kick anyone with one shot xD"),
  async execute(interaction) {
    let target = interaction.options.getMember("user");
    if (target.id === clientId) {
      return await interaction.reply("Nope. Can't ban the bot.");
    }

    if (!target) {
      return await interaction.reply(
        `**${interaction.user.username}**, Please mention the person who you want to kick`
      );
    }

    if (target.id === interaction.user.id) {
      return await interaction.reply(
        `**${interaction.user.username}**, You can not kick yourself`
      );
    }

    let embed = new EmbedBuilder()
      .setTitle("Action: Kick")
      .setDescription(`Kicked ${target} (${target.id})`)
      .setColor("#ff2050");

    await interaction.reply({ embeds: [embed] });

    target.kick();
  },
};
