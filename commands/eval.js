const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionsBitField,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("eval")
		.setDescription("This warns a user")
		.addStringOption((option) =>
			option
				.setName("code")
				.setDescription("code to eval")
				.setRequired(true),
		),
	async execute(interaction) {
		async function sendMessage(message) {
			const embed = new EmbedBuilder()
				.setColor("Blurple")
				.setDescription(message);

			await interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (!interaction.author.id === "466778567905116170") return;

		var code = interaction.options.getString("code");
		var output;
		try {
			output = await eval(code);
		} catch (error) {
			output = error.toString();
		}

		var replyString = `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n\n**Output**\n\`\`\`js\n${output}\n\`\`\``;
		if (interaction.replied) {
			const embed = new EmbedBuilder()
				.setColor("Blurple")
				.setDescription(replyString);

			await interaction.editReply({
				content: ``,
				embeds: [embed],
				ephemeral: true,
			});
		} else {
			await sendMessage(replyString);
		}
	},
};
