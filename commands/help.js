const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const page = require('discord-pagination-advanced');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lists all available commands"),
  async execute(interaction) {
    let str;
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      str += `Name: ${command.data.name}, Description: ${command.data.description} \n`;
    }

    return interaction.reply({
      content: str,
      ephemeral: false,
    });
  }
}