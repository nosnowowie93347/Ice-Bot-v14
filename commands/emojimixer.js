const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const superagent = require('superagent')
const { tenorkey } = require('../config.json')
const onlyEmoji = require('emoji-aware').onlyEmoji;

module.exports = {
	data: new SlashCommandBuilder()
	.setName('emojimixer')
	.setDescription('Combine two different emojis')
	.addStringOption(option => option.setName('emojis').setDescription('Emojis to combine').setRequired(true)),
	async execute(interaction) {

		await interaction.deferReply({ ephemeral: true })
		const eString = interaction.options.getString('emojis')
		const input = onlyEmoji(eString);
		const response = `⚠️ One or more of the emojis (\`${eString}\`) are not supported. Keep in mind custom server emojis/gestures don't work.`

		const output = await superagent.get('https://tenor.googleapis.com/v2/featured')
		.query({
			key: `${tenorkey}`,
			contentfilter: "high",
			media_filter: "png_transparent",
			component: "proactive",
			collection: "emoji_kitchen_v5",
			q: input.join('_')
		}).catch(err => {console.log(err)});

		if (!output) {
			return await interaction.editReply({ content: response })
		} else if (!output.body.results[0]) {
			return await interaction.editReply({ content: response })
		} else if (eString.startsWith(`<`) || eString.endsWith(`>`)) {
			return await interaction.editReply({ content: response })
		}

		const embed = new EmbedBuilder()
		.setColor("Purple")
		.setImage(output.body.results[0].url)

		await interaction.editReply({ embeds: [embed] })
	}
}