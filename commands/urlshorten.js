const { rapidapikey } = require("../config.json");
const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
	mod: false,
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName("url-shortener")
		.setDescription("shorten a url")
		.addStringOption((option) =>
			option
				.setName("link")
				.setRequired(true)
				.setDescription("Link to shorten"),
		)
		.addStringOption((option) =>
			option.setName("alias").setDescription("Alias for your short url"),
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const link = interaction.options.getString("link");
		const alias = interaction.options.getString("alias");

		const input = {
			method: "POST",
			url: "https://url-shortener23.p.rapidapi.com/shorten",
			headers: {
				"content-type": "application/json",
				"X-RapidAPI-Key": `${rapidapikey}`,
				"X-RapidAPI-Host": "url-shortener23.p.rapidapi.com",
			},
			data: {
				url: link,
				alias: alias,
			},
		};

		try {
			const output = await axios.request(input);
			const embed = new EmbedBuilder()
				.setColor("Blurple")
				.setDescription(
					`Here is your shortened url for \`${link}\`: ${output.data.short_url}`,
				);

			await interaction.editReply({ embeds: [embed] });
		} catch (e) {
			console.log(e);
			if (e.statusCode === 400) {
				return await interaction.editReply({
					content: `⚠ The alias ${alias} is already in use!`,
				});
			} else {
				return await interaction.editReply({
					content: `⚠ There was an error while shortening the URL. Try again later.`,
				});
			}
		}
	},
};
