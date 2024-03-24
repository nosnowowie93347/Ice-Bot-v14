const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const pagination = require("../../utils/pagination");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("testpagination")
		.setDescription("test"),
	async execute(interaction) {
		const embeds = [];
		for (var i = 0; i < 6; i++) {
			embeds.push(
				new EmbedBuilder()
					.addFields({ name: "TEST", value: "hello" })
					.setDescription(`Page ${i + 1}`),
			);
		}
		await pagination(interaction, embeds);
	},
};
