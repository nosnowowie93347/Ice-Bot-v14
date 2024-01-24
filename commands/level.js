const {
  Client,
  SlashCommandBuilder,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const { RankCardBuilder, Font } = require("canvacord");
const calculateLevelXp = require("../utils/calculateLevelXp");
const Level = require("../models/Level");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("check a user's level")
    .addUserOption((option) =>
      option
        .setName("target-user")
        .setRequired(true)
        .setDescription("user to check"),
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const mentionedUserId = interaction.options.getUser("target-user").value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
          : "You don't have any levels yet. Chat a little more and try again.",
      );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      "-_id userId level xp",
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank =
      allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    const rank = new RankCardBuilder()
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setProgressCalculator(() => {
        Math.floor(Math.random() * 100);
      })
      .setUsername(targetUserObj.user.username);
    Font.loadDefault();
    const data = await rank.build();
    const attachment = new AttachmentBuilder(data);
    interaction.editReply({ files: [attachment] });
  },
};
