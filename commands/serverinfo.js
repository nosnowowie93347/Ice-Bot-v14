const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("get info about this server"),

  async execute(interaction) {
    const icon = interaction.guild.iconURL();
    const roles = interaction.guild.roles.cache.size;
    const emojis = interaction.guild.emojis.cache.size;
    const id = interaction.guild.id;
    let baseVerification = interaction.guild.VerificationLevel;

    if (baseVerification == 0) baseVerification = "none";
    if (baseVerification == 1) baseVerification = "low";
    if (baseVerification == 2) baseVerification = "medium";
    if (baseVerification == 3) baseVerification = "high";
    if (baseVerification == 4) baseVerification = "very high";

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setThumbnail(icon)
      .setAuthor({ name: interaction.guild.name, iconURL: icon })
      .setTimestamp()
      .addFields({
        name: "Name",
        value: `${interaction.guild.name}`,
        inline: false,
      })
      .addFields({
        name: "Date Created: ",
        value: `<t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R> (hover for full date)`,
        inline: true,
      })
      .addFields({
        name: "Role Number: ",
        value: `${roles}`,
        inline: true,
      })
      .addFields({
        name: "Owner: ",
        value: `<@${interaction.guild.ownerId}>`,
        inline: true,
      })
      .addFields({
        name: "Emoji Number: ",
        value: `${emojis}`,
        inline: true,
      })
      .addFields({
        name: "Verification Level: ",
        value: `${interaction.guild.VerificationLevel}`,
        inline: true,
      });

    interaction.reply({ embeds: [embed] });
  },
};
