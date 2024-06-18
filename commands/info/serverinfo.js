const {
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

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
    let bans = interaction.guild.bans.fetch();
    if (baseVerification == 0) baseVerification = "none";
    if (baseVerification == 1) baseVerification = "low";
    if (baseVerification == 2) baseVerification = "medium";
    if (baseVerification == 3) baseVerification = "high";
    if (baseVerification == 4) baseVerification = "very high";
    var voice_channels = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildVoice,
    ).size;
    var text_channels = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildText,
    ).size;
    var animatedemoijis = interaction.guild.emojis.cache.filter((e) => e.animated == true).size;
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setThumbnail(icon)
      .setImage(interaction.guild.bannerURL())
      .setAuthor({ name: interaction.guild.name, iconURL: icon })
      .setTimestamp()
      .addFields({
        name: "Name",
        value: `${interaction.guild.name}`,
        inline: false,
      })
      .addFields({
        name: "Guild Description",
        value: `${interaction.guild.description}`,
        inline: true,
      })
      .addFields({
        name: "Members",
        value: `${interaction.guild.memberCount}`,
        inline: true,
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
        name: "Text Channel Number: ",
        value: `${text_channels}`,
        inline: true,
      })
      .addFields({
        name: "Voice Channel Number",
        value: `${voice_channels}`,
        inline: true,
      })
      .addFields({
        name: "MFA Level",
        value: `${interaction.guild.mfaLevel}`,
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
        name: "Animated: ",
        value: `${animatedemoijis}`,
        inline: true,
      })

    interaction.reply({ embeds: [embed] });
  },
};
