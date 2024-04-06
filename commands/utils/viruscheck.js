const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { virusAPIKey } = require('../../config.json')
const axios = require("axios")

module.exports = {
	cooldown: 20,
	data: new SlashCommandBuilder()
	.setName('virus-check')
	.setDescription('Checks a website for any viruses')
	.addStringOption(option => option.setName('website')
		.setDescription('Website to check')
		.setRequired(true)),
	async execute (interaction) {

		const url = interaction.options.getString('website')
		console.log(url)
		await interaction.deferReply({ ephemeral: true })

		async function sendMessage(message) {
			const embed = new EmbedBuilder()
			.setColor("#FF00C0")
			.setDescription(message)

			await interaction.editReply({ embeds: [embed] })
		}

		async function checkURL(url) {
			// try {

			const urlToCheck = encodeURI(url);
			const apiUrl = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${virusAPIKey}&resource=${urlToCheck}`;
			const response = await axios.get(apiUrl);
			const data = response.data;

			// if (data.verbose_msg == `Resource does not exist in the dataset`) return "⚠ That is not a valid URL, or does not exist in the dataset";

			const scanDate = new Date(data.scan_date);
			const formattedScanDate = `<t:${Math.floor(scanDate.getTime() / 1000)}:F>`;

			var results = ""
			if (data.positives > 0) results = `> ⚠ **This website contains a virus. Click below to track each virus.**`;
			else results = "> 🧼 This site is clean and safe to use!";

			const dataObj = {
				url: `▶ 🔗 Checked URL: \`${url}\``,
				scanDate: `▶ 📅 Scan Date: ${formattedScanDate}`,
				positives: `▶ 📫 Positives: \`${data.positives}/${data.total}\``,
				results: results,
				full: `▶ Click [here](${data.permalink}) to view full results of this scan.`
			};

			return `🌎 **Your Virus Scan Report:** \n\n${Object.values(dataObj).join('\n')}\n\n *Please note: the scan date is the time the virus api most recently checked the website**`;
		// } catch (e) {
		// 	return "⚠ An error has occurred while checking this URL.";
		// }
		}

		var output = await checkURL(url);
		await sendMessage(output);
	}
}