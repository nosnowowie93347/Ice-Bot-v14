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
	cooldown: 20,
	data: new SlashCommandBuilder()
		.setName("ytmp4")
		.setDescription("download a youtube video")
		.addStringOption((option) =>
			option
				.setName("video-id")
				.setDescription("id of the video to download")
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();
		const vidId = interaction.options.getString("video-id");
		const input = {
			method: "GET",
			url: "https://youtube-video-download-info.p.rapidapi.com/dl",
			params: { id: vidId },
			headers: {
				"X-RapidAPI-Key": `${rapidapikey}`,
				"X-RapidAPI-Host": "youtube-video-download-info.p.rapidapi.com",
			},
		};

		try {
			const output = await axios.request(input);
			const link = output.data.link[22];
			const button = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setLabel(`📬 Download MP4`)
					.setStyle(ButtonStyle.Link)
					.setURL(link[0]),
			);

			const embed = new EmbedBuilder()
				.setColor("Blurple")
				.setDescription(
					`Download the mp4 version of \`${output.data.title}\` below!`,
				);

			await interaction.editReply({
				embeds: [embed],
				components: [button],
			});
		} catch (e) {
			console.log(e);
			await interaction.editReply({
				content: `⚠️ That video id is not valid. Go to the url and copy the id at the end.`,
			});
		}
	},
};
