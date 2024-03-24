const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const blacklist = require("../../models/wordBlacklist");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("blacklist")
		.setDescription("blahblahblah")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((command) =>
			command
				.setName("add")
				.setDescription("Word to add")
				.addStringOption((option) =>
					option
						.setName("word")
						.setDescription("Word you wanna add")
						.setRequired(true),
				),
		),
	async execute(interaction) {
		const sub = interaction.options.getSubcommand();
		switch (sub) {
			case "add":
				const word = interaction.options.getString("word");
				let data = await blacklist.findOne({
					guildid: interaction.guild.id,
				});
				if (!data) {
					data = await blacklist.create({
						guildid: interaction.guild.id,
					});
				}
				if (data.words.includes(word)) {
					return interaction.reply({
						content: "⚠ This word is already blacklisted.",
					});
				}

				data.words.push(word);
				await data.save();
				interaction.reply({ content: `${word} had been added.` });
		}
	},
};
