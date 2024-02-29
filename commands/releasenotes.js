const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const notes = require("../models/releasenotes");

module.exports = {
	cooldown: 15,
	data: new SlashCommandBuilder()
		.setName("releasenotes")
		.setDescription("Release notes")
		.addSubcommand((command) =>
			command
				.setName("publish")
				.setDescription("publish release notes")
				.addStringOption((option) =>
					option
						.setName("updated-notes")
						.setDescription("updated notes")
						.setRequired(true),
				),
		)
		.addSubcommand((command) =>
			command
				.setName("view")
				.setDescription("view most recent release notes"),
		),
	async execute(interaction) {
		const sub = interaction.options.getSubcommand();
		var data = await notes.find();

		async function sendMessage(message) {
			const embed = new EmbedBuilder()
				.setColor("#ffc0cb")
				.setDescription(message);

			await interaction.reply({ embeds: [embed], ephemeral: true });
		}

		async function updateNotes(update, version) {
			await notes.create({
				Updates: update,
				Date: Date.now(),
				Developer: interaction.user.username,
				Version: version,
			});

			await sendMessage(`🌎 I have updated your release notes`);
		}

		switch (sub) {
			case "publish":
				if (interaction.user.id !== "466778567905116170")
					await sendMessage(
						`⚠ Only developers can use this command!`,
					);
				else {
					const update =
						interaction.options.getString("updated-notes");
					if (data.length > 0) {
						await notes.deleteMany();
						var version = 0;
						await data.forEach(async (value) => {
							version += value.Version;
						});

						await updateNotes(update, version + 0.1);
					} else {
						await updateNotes(update, 1.0);
					}
				}
				break;
			case "view":
				if (data.length == 0)
					await sendMessage(
						`⚠ There are no public release notes yet...`,
					);
				else {
					var string = ``;
					await data.forEach(async (value) => {
						string += `\`${value.Version}\` \n\n**Update Information:**\n\`\`\`${value.Updates}\`\`\`\n\n**Updating Developer:** ${value.Developer}\n**Update Date:** <t:${Math.floor(value.Date / 1000)}:R>`;

						await sendMessage(`🌎 **Release Notes** ${string}`);
					});
				}
		}
	},
};
