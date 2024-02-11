const { SlashCommandBuilder } = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder().setName("teste").setDescription("fuck"),
	async execute(interaction) {
		interaction.reply("tese");
	},
};
