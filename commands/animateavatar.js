const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
	.setName(`avatar`)
	.setDescription("Change the bot's avatar")
	.addAttachmentOption(option => option.setName(`avatar`).setDescription(`the file`).setRequired(true)),
	async execute (interaction) {
		const avatar = interaction.options.getAttachment('avatar')

		async function sendMessage (message) {
			const embed = new EmbedBuilder()
			.setColor('#00ff00')
			.setDescription(message)

			await interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (avatar.contentType !== "image/gif") return await sendMessage(`❌ Use a gif, please. Static avatars are **so** last year...`)

		var error;
		await interaction.client.user.setAvatar(avatar.url).catch(async err => {
			error = true;
			console.log(error)
			return await sendMessage(`⚠ Error : \`${err.toString()}\``);
		})

		if (error) return;
		await sendMessage(`🌎 I have uploaded your avatar.`)
	}
}