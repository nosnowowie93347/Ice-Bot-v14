const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder()
    .setName(`minecraft-server`) 
    .setDescription(`Tells A Minecraft Server Stats`)
    .addStringOption(option => option.setName(`ip`).setDescription(`The IP address of the server.`).setRequired(true)),
  async execute(interaction, client) {

    interaction.deferReply()

    const ip = interaction.options.getString(`ip`);
    const url = `https://api.mcsrvstat.us/1/${ip}`;

    const errEmbed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Error: Unable to access server status.")
    .setDescription(`The server is either offline or its a bedrock server or the IP provided is wrong.`)

    try {
      const data = await fetch(url).then((response) => response.json());
      const serverip = data.hostname;
      const realip = data.ip;
      const port = data.port;
      const version = data.version;
      const onlineplayers = data.players.online;
      const maxplayers = data.players.max;
      const motd = data.motd.clean     
      
      const embed = new EmbedBuilder()
        .setColor(`Aqua`)
        .addFields(
          { name: "Server", value: serverip },
          { name: "IP Address", value: `${realip}`, inline: true},
          { name: "Port", value: `${port}`, inline: true},
          { name: "Version", value: version.toString() },
          { name: "MOTD", value: motd.toString()}, 
          {
            name: "Online Players",
            value: onlineplayers.toString(),
            inline: true,
          },
          { name: "Max Players", value: maxplayers.toString(), inline: true }
        );
        await interaction.editReply({ embeds: [embed]});
      } catch (error) {
        interaction.editReply({embeds: [errEmbed], ephemeral: true});
      }
  },
};