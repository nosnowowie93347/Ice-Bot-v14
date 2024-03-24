const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonStyle,
	ButtonBuilder,
	PermissionsBitField,
	ChannelType,
	StringSelectMenuBuilder,
} = require("discord.js");
const ticket = require("../../models/ticketSchema");

module.exports = {
	mod: true,
	cooldown: 15,
	data: new SlashCommandBuilder()
		.setName("ticket")
		.setDescription("Manage ticket system")
		.addSubcommand((command) =>
			command
				.setName("send")
				.setDescription("Send ticket message")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("Name for open select menu content")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("message")
						.setDescription("Custom message")
						.setRequired(false),
				),
		)
		.addSubcommand((command) =>
			command
				.setName("setup")
				.setDescription("Setup ticket category")
				.addChannelOption((option) =>
					option
						.setName("category")
						.setDescription("Category to send tickets in")
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildCategory),
				),
		)
		.addSubcommand((command) =>
			command.setName("remove").setDescription("Disable ticket system"),
		),
	async execute(interaction) {
		const sub = interaction.options.getSubcommand();
		const data = await ticket.findOne({ Guild: interaction.guild.id });

		switch (sub) {
			case "send":
				if (!data)
					return await interaction.reply({
						content: `⚠ You must do /ticket setup before you can send ticket messages...`,
						ephemeral: true,
					});
				const name = interaction.options.getString("name");
				var message =
					interaction.options.getString("message") ||
					"Create a ticket to talk with staff! Use input below to describe why you create this ticket";

				const select = new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("ticketCreateSelect")
						.setPlaceholder(`🌎 ${name}`)
						.setMinValues(1)
						.addOptions({
							label: "create your ticket",
							description: "Click to begin ticket creation",
							value: "createTicket",
						}),
				);

				const embed = new EmbedBuilder()
					.setColor("Red")
					.setTitle("🎟 Create a ticket")
					.setDescription(message + " 🎟")
					.setFooter({
						text: `${interaction.guild.name}`,
						iconURL: `${interaction.guild.iconURL()}`,
					});

				await interaction.reply({
					content: `🌎 I have sent your ticket message below`,
					ephemeral: true,
				});
				await interaction.channel.send({
					embeds: [embed],
					components: [select],
				});

				break;
			case "remove":
				if (!data)
					return await interaction.reply({
						content: `⚠ You must do /ticket setup before you can send ticket messages...`,
						ephemeral: true,
					});
				else {
					await ticket.deleteOne({
						Guild: interaction.guild.id,
					});
					await interaction.reply({
						content: `Ticket category deleted.`,
						ephemeral: true,
					});
				}

				break;
			case "setup":
				if (data)
					return await interaction.reply({
						content: `Looks like you have tickets setup already`,
						ephemeral: true,
					});
				else {
					const category = interaction.options.getChannel("category");
					await ticket.create({
						Guild: interaction.guild.id,
						Category: category.id,
					});

					await interaction.reply({
						content: `🌎 I have set the category to **${category}**! Use /ticket send to send a ticket create message`,
						ephemeral: true,
					});
				}
		}
	},
};
