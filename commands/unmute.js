const {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute someone")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setRequired(true).setDescription("user to mute")
    ),
  async execute(interaction) {
    const member = interaction.options.getUser("user");
    const user = interaction.guild.members.cache.get(member.id);

    if (!user) {
      return interaction.reply(
        "Please mention the member to who you want to unmute"
      );
    }

    if (user.id === interaction.user) {
      return interaction.reply("I won't unmute you -_-");
    }

    const errEmbed = new EmbedBuilder()
      .setDescription("Something went wrong.")
      .setColor(0xc72c3b);

    const successEmbed = new EmbedBuilder()
      .setTitle("**:white_check_mark: Unmuted**")
      .setDescription(`Successfully unmuted ${user}.`)
      .setColor(0x5fb041)
      .setTimestamp();

    if (
      user.roles.highest.position >= interaction.member.roles.highest.position
    ) {
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }

    try {
      await user.timeout(null);

      interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (err) {
      console.log(err);
    }
  },
};
