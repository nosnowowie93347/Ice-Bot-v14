const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js')
const log = require('../../models/deletemsglog.js')

module.exports = {
	cooldown: 15,
	data: new SlashCommandBuilder()
	.setName('deleted-message-logger')
	.setDescription('Logging system for deleted messages.')
	.addSubcommand(command => command.setName(`setup`).setDescription(`Setup the logging system for deleted messages.`).addChannelOption(option=>option.setName(`channel`).setDescription(`The channel to log messages in`).addChannelTypes(ChannelType.GuildText).setRequired(true)))
	.addSubcommand(command => command.setName(`disable`).setDescription(`Disable the logging system for deleted messages.`)),
	async execute (interaction) {

		const sub = interaction.options.getSubcommand();
		var data = await log.findOne({ Guild: interaction.guild.id })

		async function sendMessage (message) {
			const embed = new EmbedBuilder()
			.setTitle(`Deleted Message Logging System`)
			.setDescription(message)
			.setColor("Blue")
			.setTimestamp()

			await interaction.reply({ embeds: [embed] , ephemeral: true })
		}

		switch (sub) {
		case "setup":
			if (data) {
				await sendMessage(`⚠ Looks like the system is already setup!`);
			} else {
				var channel = interaction.options.getChannel(`channel`)
				await log.create({
					Guild: interaction.guild.id,
					Channel: channel.id
				});

				await sendMessage(`🌎 I have setup the system in ${channel}`);
			}
			break;
		case "disable":
			if (!data) {
				await sendMessage("⚠ This system hasn't been setup yet!")
			} else {
				await log.deleteOne({ Guild: interaction.guild.id });
				await sendMessage(`🌎 I have disabled the system!`)
			}
		}
	}
}