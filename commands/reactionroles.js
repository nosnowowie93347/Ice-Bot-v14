const {
	EmbedBuilder,
	SlashCommandBuilder,
	PermissionFlagsBits,
	PermissionsBitField,
} = require("discord.js");
const reaction = require("../models/reactionrs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("reaction-roles")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.setDescription("Manage reaction roles system")
		.addSubcommand((command) =>
			command
				.setName("add")
				.setDescription("Add a reaction role to a message")
				.addStringOption((option) =>
					option
						.setName("message-id")
						.setDescription("Message to react to")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("emoji")
						.setDescription("Emoji to react with")
						.setRequired(true),
				)
				.addRoleOption((option) =>
					option
						.setName("role")
						.setDescription("role to give")
						.setRequired(true),
				),
		)
		.addSubcommand((command) =>
			command
				.setName("remove")
				.setDescription("Remove a reaction role from a message")
				.addStringOption((option) =>
					option
						.setName("message-id")
						.setDescription("Message to react to")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("emoji")
						.setDescription("Emoji to react with")
						.setRequired(true),
				),
		),
	async execute(interaction) {
		const emoji = interaction.options.getString("emoji");

		let e;
		const message = await interaction.channel.messages
			.fetch(interaction.options.getString("message-id"))
			.catch((err) => {
				e = err;
			});

		if (e)
			return await interaction.reply({
				content: `Be sure to get a message from ${interaction.channel}!`,
				ephemeral: true,
			});

		const data = await reaction.findOne({
			Guild: interaction.guild.id,
			Message: message.id,
			Emoji: emoji,
		});

		if (interaction.options.getSubcommand() === "add") {
			if (data) {
				return await interaction.reply({
					content: `Looks like you already have reaction roles setup using ${emoji} on this message.`,
					ephemeral: true,
				});
			} else {
				const role = interaction.options.getRole("role");
				await reaction.create({
					Guild: interaction.guild.id,
					Message: message.id,
					Emoji: emoji,
					Role: role.id,
				});

				const embed = new EmbedBuilder()
					.setColor("Blurple")
					.setDescription(
						`:saluting_face: I have added reaction role to ${message.url} with ${emoji} and the role ${role}`,
					);

				await message.react(emoji).catch((err) => {});

				await interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		if (interaction.options.getSubcommand() === "remove") {
			if (!data) {
				return await interaction.reply({
					content: `Doesn't look like that reaction role exists.`,
					ephemeral: true,
				});
			} else {
				await reaction.deleteMany({
					Guild: interaction.guild.id,
					Message: message.id,
					Emoji: emoji,
				});

				const embed = new EmbedBuilder()
					.setColor("Blurple")
					.setDescription(
						`:saluting_face: I have removed reaction role from ${message.url} with ${emoji}`,
					);

				await interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}
	},
};
