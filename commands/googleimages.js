const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const google = require("images-scraper");

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName("googleimages")
		.setDescription("Google an image")
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription("What would you like to find?")
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();
		const query = interaction.options.getString("query");

		const image = new google({
			puppeteer: {
				headless: true,
			},
		});

		const results = await image.scrape(query, 4);

		const mainEmbed = new EmbedBuilder()
			.setColor("DarkVividPink")
			.setURL(`https://youtube.com`)
			.setImage(results[0].url);

		const secondEmbed = new EmbedBuilder()
			.setColor("DarkVividPink")
			.setURL(`https://youtube.com`)
			.setImage(results[1].url);

		const thirdEmbed = new EmbedBuilder()
			.setColor("DarkVividPink")
			.setURL(`https://youtube.com`)
			.setImage(results[2].url);

		const fourthEmbed = new EmbedBuilder()
			.setColor("DarkVividPink")
			.setURL(`https://youtube.com`)
			.setImage(results[3].url);

		await interaction.editReply({
			embeds: [mainEmbed, secondEmbed, thirdEmbed, fourthEmbed],
		});
	},
};
