const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("randomimage")
		.setDescription("Get a random image."),
	async execute(interaction) {
		await interaction.deferReply();
		const image = await axios.get(
			`https://picsum.photos/1920/1080?random=1`,
		);

		const imageembed = new EmbedBuilder()
			.setTitle("Here's your random image")
			.setColor("Blurple")
			.setTimestamp()
			.setImage(`https://fastly.picsum.photos/${image.request.path}`);

		await interaction.editReply({ embeds: [imageembed] });
	},
};
