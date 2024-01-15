const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
<<<<<<< HEAD
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
  },
=======
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
    },
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
};
