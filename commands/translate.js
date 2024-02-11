const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName("translate")
		.setDescription("translator")
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("message")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("language")
				.setDescription("language")
				.addChoices(
					{ name: "English", value: "en" },
					{ name: "Spanish", value: "es" },
					{ name: "Irish", value: "ga" },
					{ name: "Thai", value: "th" },
					{ name: "Turkish", value: "tr" },
					{ name: "Vietnamese", value: "vi" },
					{ name: "Zulu", value: "zu" },
					{ name: "French", value: "fr" },
					{ name: "Greek", value: "el" },
					{ name: "Hawaiian", value: "haw" },
					{ name: "Russian", value: "ru" },
					{ name: "Serbian", value: "sr" },
					{ name: "German", value: "de" },
					{ name: "Portuguese", value: "pt" },
					{ name: "Italian", value: "it" },
					{ name: "Japanese", value: "ja" }
				)
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const text = interaction.options.getString("message");
		const lan = interaction.options.getString("language");

		const applied = await translate(text, { to: `${lan}` });
		console.log(applied);
		const embed = new EmbedBuilder()
			.setColor("Random")
			.addFields({
				name: "Old Text",
				value: `\`\`\`${text}\`\`\``,
				inline: false,
			})
			.addFields({
				name: "Applied Text",
				value: `\`\`\`${applied.text}\`\`\``,
				inline: false,
			});

		await interaction.editReply({ embeds: [embed] });
	},
};
