const {
	SlashCommandBuilder,
	TextInputStyle,
	EmbedBuilder,
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
} = require("discord.js");

module.exports = {
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName("report")
		.setDescription(
			"Report a broken command, or a command that is being abused",
		),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setTitle(`Bug & Command Abuse Reporting`)
			.setCustomId("bugreport");

		const command = new TextInputBuilder()
			.setCustomId("command")
			.setRequired(true)
			.setPlaceholder("Only state the command name")
			.setLabel("Which command has bug or is being abused?")
			.setStyle(TextInputStyle.Short);

		const description = new TextInputBuilder()
			.setCustomId("description")
			.setRequired(true)
			.setPlaceholder("Be as detailed as you can. More info is better.")
			.setLabel("Describe how command is bugged, or is abused.")
			.setStyle(TextInputStyle.Paragraph);

		const one = new ActionRowBuilder().addComponents(command);
		const two = new ActionRowBuilder().addComponents(description);

		modal.addComponents(one, two);

		await interaction.showModal(modal);
	},
};
