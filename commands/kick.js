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
<<<<<<< HEAD
      option.setName("user").setRequired(true).setDescription("user to kick")
=======
      option.setName("user").setRequired(true).setDescription("user to kick"),
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
    )
    .setDescription("Kick anyone with one shot xD"),
  async execute(interaction) {
    let target = interaction.options.getMember("user");
    if (target.id === clientId) {
      return await interaction.reply("Nope. Can't ban the bot.");
    }

    if (!target) {
      return await interaction.reply(
<<<<<<< HEAD
        `**${interaction.user.username}**, Please mention the person who you want to kick`
=======
        `**${interaction.user.username}**, Please mention the person who you want to kick`,
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
      );
    }

    if (target.id === interaction.user.id) {
      return await interaction.reply(
<<<<<<< HEAD
        `**${interaction.user.username}**, You can not kick yourself`
=======
        `**${interaction.user.username}**, You can not kick yourself`,
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
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
