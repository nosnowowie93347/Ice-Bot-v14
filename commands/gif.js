const { tenorkey } = require("../config.json");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");

module.exports = {
	mod: false,
	cooldown: 25,
	data: new SlashCommandBuilder()
		.setName("gif")
		.setDescription("Search for a gif to show friends.")
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription(`What is it you're searching for?`)
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const query = interaction.options.getString("query");
		const key = tenorkey;
		const clientKey = "My First Project";
		const lmt = 8;
		let choice = Math.floor(Math.random() * lmt);
		const link =
			"https://tenor.googleapis.com/v2/search?q=" +
			query +
			"&key=" +
			key +
			"&clientKey=" +
			clientKey +
			"&limit=" +
			lmt;

		const output = await superagent.get(link).catch((err) => {
			console.log(`Error detected! ${err}`);
		});

		try {
			await interaction.editReply({
				content: output.body.results[choice].itemurl,
			});
		} catch (e) {
			return await interaction.editReply({
				content: `⚠️ I could not find a matching gif to \`${query}\`! `,
			});
		}
	},
};
