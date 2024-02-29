const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require("discord.js");

module.exports = {
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Delete a certain number of messages")
		.addIntegerOption((option) =>
			option
				.setName("number")
				.setDescription("Number of messages to delete")
				.setMinValue(1)
				.setMaxValue(100)
				.setRequired(true),
		),
	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
			return await interaction.reply({ content: `❌ You do not have permission to use this command.`, ephemeral: true })
		}
		let amount = interaction.options.getInteger("number");

		const embed = new EmbedBuilder()
			.setColor("#FF009C")
			.setTitle(`⭐ Message Deletion Service`)
			.setDescription(`✔ Deleted ${amount} messages`);
		await interaction.channel.bulkDelete(amount, true);

		const button = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("purge")
				.setEmoji(`🗑️`)
				.setStyle(ButtonStyle.Primary),
		);

		const message = await interaction.reply({
			embeds: [embed],
			components: [button],
		});

		const collector = message.createMessageComponentCollector();
		collector.on("collect", async (i) => {
			if (i.customId === "purge") {
				interaction.deleteReply();
			}
		});
	},
};
