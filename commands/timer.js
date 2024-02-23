const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

module.exports = {
	cooldown: 15,
	mod: false,
	data: new SlashCommandBuilder()
	.setName('timer')
	.setDescription('Start a timer.')
	.addNumberOption(option=>option.setName('timer-number').setDescription('The number of seconds for the timer').setRequired(true)),
	async execute(interaction) {
		const num = interaction.options.getNumber('timer-number')

		async function sendMessage(message, edit) {
			const embed = new EmbedBuilder()
			.setTitle(`A timer!`)
			.setColor("#008080")
			.setDescription(message)
			.setFooter({ text: `This timer might be ~1-2 seconds off due to API limits` })

			if (edit) {
				await interaction.editReply({ embeds: [embed] }).catch(err => {
					console.log(`An error has occured: ${err}`)
				})
			} else {
				await interaction.reply({ embeds: [embed], ephemeral: true })
			}
		}

		var current = 0
		await sendMessage(`🌍 \`${num - current}\` seconds remain out of your ${num} second timer`)

		var done;
		if (done) return;
		setInterval(async () => {
			current++;
			if (current >= num) {
				await sendMessage(`👍 **Your timer is done!**`, true)
				done = true;
			} else {
				await sendMessage(`🌍 \`${num - current}\` seconds remain out of your ${num} second timer`, true)
			}
		}, 1000)
	}
}