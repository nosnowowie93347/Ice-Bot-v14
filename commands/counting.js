const {
	SlashCommandBuilder,
	EmbedBuilder,
	ChannelType,
	PermissionsBitField,
} = require("discord.js");
const counting = require("../models/countingschema");

module.exports = {
	cooldown: 20,
	data: new SlashCommandBuilder()
		.setName("counting")
		.setDescription("Manage the counting system")
		.addSubcommand((command) =>
			command
				.setName("setup")
				.setDescription("setup counting system")
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription("channel for counting")
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true)
				)
		)
		.addSubcommand(command => command.setName('disable').setDescription('disable counting system')),
		async execute(interaction) {
			const sub = interaction.options.getSubcommand()
			const data = await counting.findOne({ Guild: interaction.guild.id })

			if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You do not have permission to use this command", ephemeral: true });

			switch (sub) {
			case 'setup':
				if (data) {
					return await interaction.reply({ content: "You've already setup the counting system.", ephemeral: true })
				} else {
					const channel = interaction.options.getChannel('channel')
					await counting.create({
						Guild: interaction.guild.id,
						Channel: channel.id,
						Number: 1
					});

					const embed = new EmbedBuilder()
					.setColor("Blurple")
					.setDescription(`System setup! Go to ${channel} and start at number 1`)

					await interaction.reply({ embeds: [embed], ephemeral: true })
				}

				break;
			case 'disable':

				if (!data) {
					return await interaction.reply({ content: "System not setup yet.", ephemeral: true })
				} else {
					await counting.deleteOne({
						Guild: interaction.guild.id,
					});

					const embed = new EmbedBuilder()
					.setColor("Blurple")
					.setDescription(`The counting system has been disabled for this server`)

					await interaction.reply({ embeds: [embed], ephemeral: true })
				}
			}
		}
};
