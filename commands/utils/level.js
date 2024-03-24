const {
  Client,
  SlashCommandBuilder,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const { Rank, Font } = require("canvacord");
const calculateLevelXp = require("../../utils/calculateLevelXP");
const Level = require("../../models/Level");

module.exports = {
  cooldown: 10,
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

    const mentionedUserId = interaction.options.getUser("target-user");

    const targetUserId = mentionedUserId;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);
    const targetUser = targetUserObj.id;

    const fetchedLevel = await Level.findOne({
      userId: targetUser,
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
      allLevels.findIndex((lvl) => lvl.userId === targetUser) + 1;

    const rank = new Rank()
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank)
      .setBackground("COLOR", "#008000")
      .setLevel(fetchedLevel.level)
      .setLevelColor("#00ffff", "#00ffff")
      .setStatus(
        targetUserObj.presence ? targetUserObj.presence.status : "offline",
      )
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setProgressBar("#ffc0cb", "COLOR")
      .setUsername(targetUserObj.user.username);
    rank.build().then((buffer) => {
      const attachment = new AttachmentBuilder(buffer, "rank.png");
      interaction.editReply({ files: [attachment] });
    });
  },
};
