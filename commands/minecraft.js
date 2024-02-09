const {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  cooldown: 20,
  data: new SlashCommandBuilder()
    .setName("minecraft-server")
    .setDescription("Get info on a Minecraft server")
    .addStringOption((option) =>
      option
        .setName("ip")
        .setDescription("The server to search for")
        .setRequired(true)
    ),
  async execute(interaction) {
    const ip = interaction.options.getString("ip");
    var msg;

    async function sendMessage(message, button, updated) {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTimestamp()
        .setDescription(message);

      if (button) {
        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("mcserverRefresh")
            .setLabel("Refresh Stats")
            .setStyle(ButtonStyle.Danger)
        );

        if (updated) {
          await interaction.editReply({
            embeds: [embed],
            components: [button],
          });
          await updated.reply({
            content: `I have updated your stats.`,
            ephemeral: true,
          });
        } else {
          msg = await interaction.reply({
            embeds: [embed],
            components: [button],
            ephemeral: true,
          });
        }
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
      console.log("test");
    }

    var getData = await fetch(`https://mcapi.us/server/status?ip=${ip}`);
    var response = await getData.json();

    if (response.status == "error") {
      await sendMessage(`⚠️ \`${ip}\` is either offline, or doesn't exist.`);
    }
    if (response.status == "success") {
      await sendMessage(
        `🌎 **Minecraft Server Stats:** \n\nOnline: ${response.online}\nName: ${response.server.name}\nIP: ${ip.toLowerCase()}\nPlayer Max: ${response.players.max}\nCurrent Players: ${response.players.now}`
      );
      const collector = msg.createMessageComponentCollector();
      collector.on("collect", async (i) => {
        if (i.customId == "mcserverRefresh") {
          var updatedData = await fetch(
            `https://mcapi.us/server/status?ip=${ip}`
          );
          var response = await updatedData.json();
          await sendMessage(
            `🌎 **Minecraft Server Stats:** \n\nOnline: ${response.online}\nName: ${response.server.name}\nIP: ${ip.toLowerCase()}\nPlayer Max: ${response.players.max}\nCurrent Players: ${response.players.now}`
          );
        }
      });
    }
  },
};
