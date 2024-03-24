const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const blacklist = require('../../models/blacklist');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('userblacklist')
	.setDescription('blacklist users that are abusing the bot')
	.addSubcommand(command => command.setName('add').setDescription('add user to blacklist').addStringOption(option => option.setName('user').setDescription('user to add').setRequired(true)))
	.addSubcommand(command => command.setName('remove').setDescription('remove user to blacklist').addStringOption(option => option.setName('user').setDescription('user to remove').setRequired(true))),
	async execute (interaction) {
		const user = interaction.options.getString('user')
		const data = await blacklist.findOne({ User: user })
		const sub = interaction.options.getSubcommand()

		switch (sub) {
		case 'add':
			if (!data) {
				await blacklist.create({ User: user })
				const embed = new EmbedBuilder()
				.setColor("Green")
				.setDescription(`🛠 The user \`${user}\` was blacklisted.`)

				await interaction.reply({ embeds: [embed], ephemeral: true })
			} else if (data) {
				return await interaction.reply(`The user \`${user}\` was already blacklisted!`)
			}
			break;
		case 'remove':
			if (!data) return await interaction.reply(`The user \`${user}\` is NOT blacklisted!`);
			else if (data) {
				await blacklist.deleteOne({ User: user })
				const embed = new EmbedBuilder()
				.setColor("Green")
				.setDescription(`🛠 The user \`${user}\` was removed from blacklist.`)

				await interaction.reply({ embeds: [embed], ephemeral: true })
			}
		}
	}
}