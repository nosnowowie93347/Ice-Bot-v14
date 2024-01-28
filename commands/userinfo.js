const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const activityType = ["Playing", "Streaming", "Listening to", "Watching"];

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("show info about users")
    .addUserOption((option) =>
      option
        .setName("user")
        .setRequired(true)
        .setDescription("User to look up"),
    ),
  async execute(interaction) {
    let target = interaction.options.getUser("user");
    target = await interaction.guild.members.fetch(target);
    var array = target.flags.toArray();
    if (array.length == 0) {
      array.push("None");
    } else {
      array.forEach((flag) => {
        array.push(flag);
      });
    }
    const clientType = [
      { name: "desktop", text: "Computer", emoji: "🖥️" },
      { name: "mobile", text: "Phone", emoji: "📱" },
      { name: "web", text: "Browser", emoji: "🌐" },
      { name: "offline", text: "Offline", emoji: "💤" },
    ];

    const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
      let totalLength = 0;
      const result = [];
      for (const role of roles) {
        const roleString = `<@${role.id}>`;

        if (roleString.length + totalLength > maxFieldLength) {
          break;
        }
        totalLength += roleString.length + 1;
        result.push(roleString);
      }
      return result.length;
    };
    const clientStatus =
      target.presence?.clientStatus instanceof Object
        ? Object.keys(target.presence.clientStatus)
        : "offline";
    const deviceFilter = clientType.filter((device) =>
      clientStatus.includes(device.name),
    );
    const devices = !Array.isArray(deviceFilter)
      ? new Array(deviceFilter)
      : deviceFilter;
    const sortedRoles = target.roles.cache
      .map((role) => role)
      .sort((a, b) => b.position - a.position)
      .slice(0, target.roles.cache.size - 1);

    const response = new EmbedBuilder()
      .setAuthor({
        name: `User information for ${target.displayName}`,
        iconURL: target.displayAvatarURL(),
      })
      .setImage(target.displayAvatarURL({ extension: "png", size: 512 }))
      .setColor("Random")
      .addFields(
        {
          name: "Username",
          value: target.user.username,
          inline: true,
        },
        {
          name: "Joined Server",
          value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Nickname",
          value: target.nickname || "None",
          inline: true,
        },
        {
          name: "Is a bot?",
          value: `${target.user.bot}`,
          inline: true,
        },
        {
          name: "Color",
          value: `${target.displayHexColor}`,
          inline: true,
        },
        {
          name: "Status",
          value: `${target.presence ? target.presence.status : "offline"}`,
          inline: true,
        },
        {
          name: "Activities",
          value:
            target.presence?.activities
              .map(
                (activity) => `${activityType[activity.type]} ${activity.name}`,
              )
              .join("\n") || "None",
          inline: true,
        },
        {
          name: "Devices",
          value: devices
            .map((device) => `${device.emoji} ${device.text}`)
            .join(`\n`),
          inline: true,
        },

        {
          name: "Has passed screening?",
          value: `${target.pending}`,
          inline: true,
        },
        {
          name: `Roles ${maxDisplayRoles(sortedRoles)} of ${sortedRoles.length}`,
          value: `${sortedRoles.slice(0, maxDisplayRoles(sortedRoles)).join(" ") || "None"}`,
          inline: true,
        },

        {
          name: "Tag",
          value: `${target.user.tag}`,
          inline: true,
        },
        {
          name: "ID",
          value: target.id,
          inline: true,
        },
        {
          name: "Discord Registered",
          value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R> (hover for full date)`,
        },
      )
      .setFooter({ text: `Requested by ${target.user.tag}` })
      .setTimestamp(Date.now());
    await interaction.reply({ embeds: [response] });
  },
};
