const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const ms = require("ms")

module.exports = {
  data: new SlashCommandBuilder()
  .setName("mute")
  .setDescription("Mute anyone who break rules")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption(option => option
    .setName("user")
    .setRequired(true)
    .setDescription("user to mute")
    )
  .addStringOption(option => option
    .setName("time")
    .setRequired(true)
    .setDescription("How long should this mute last?")
    )
  .addStringOption(option => option
    .setName("reason")
    .setRequired(true)
    .setDescription("Why are you muting this person?")
    ),
  async execute(interaction) {

    const member = interaction.options.getUser("user");
    const user = interaction.guild.members.cache.get(member.id);
    
    if(!user) {
      return interaction.reply("Please mention the member to who you want to mute")
    }
    
    if(user.id === interaction.user) {
      return interaction.reply("I won't mute you -_-");
    }
    
    const time = interaction.options.getString("time")
    const convertedTime = ms(time)
    let reason = interaction.options.getString("reason")
    

    const errEmbed = new EmbedBuilder()
      .setDescription("Something went wrong.")
      .setColor(0xc72c3b)

    const successEmbed = new EmbedBuilder()
      .setTitle("**:white_check_mark: Muted**")
      .setDescription(`Successfully muted ${user}.`)
      .addFields(
        { name: "Reason", value: `${reason}`, inline: true },
        { name: "Duration", value: `${time}`, inline: true }
      )
      .setColor(0x5fb041)
      .setTimestamp();

    if (user.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ embeds: [errEmbed], ephemeral: true })
    }

    if (!convertedTime)
      return interaction.reply({ embeds: [errEmbed], ephemeral: true })

    try {
      await user.timeout(convertedTime, reason);

      interaction.reply({ embeds: [successEmbed], ephemeral: true })
    } catch(err) {
      console.log(err)
    }
  }
}