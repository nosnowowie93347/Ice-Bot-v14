const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	owner: true,
	cooldown: 30,
	data: new SlashCommandBuilder()
	.setName(`shutdown`)
	.setDescription(`Shut down the bot (owner only)`),
	async execute (interaction) {

		const guilds = await interaction.client.guilds.fetch()

		var owners = [];
		await guilds.forEach(async guild => {
			var guildInfo = await interaction.client.guilds.fetch(guild.id)
			owners.push(guildInfo.ownerId);
		});

		owners = [...new Set(owners)];

		await owners.forEach(async owner => {
			var user = await interaction.client.users.fetch(owner);
			await user.send(`⚠ The bot is shutting down for downtime/updates...`).catch(err => {});
		});

		await interaction.reply({ content: `💪 Shutting down...`, ephemeral: true });
		await process.exit();
	}
}