const {
	SlashCommandBuilder,
	AttachmentBuilder,
	EmbedBuilder,
	PermissionsBitField,
} = require("discord.js");
const Level = require("../models/Level");

module.exports = {
	cooldown: 15,
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("Gets the leaderboard for the level system"),
	async execute(interaction) {
		let text = "";

		const embed1 = new EmbedBuilder()
			.setColor("Blue")
			.setDescription(
				`:white_check_mark: No one is on the leaderboard yet...`,
			);

		const Data = await Level.find({ guildId: interaction.guild.id })
			.sort({
				level: -1,
				xp: -1,
			})
			.limit(10);

		if (!Data) return await interaction.reply({ embeds: [embed1] });

		await interaction.deferReply();
		for (let counter = 0; counter < Data.length; ++counter) {
			let { userId, xp, level } = Data[counter];
			const value = await interaction.client.users.fetch(userId);
			const member = value.tag;

			text += `${counter + 1}. ${member} | XP: ${xp} | Level: ${level} \n`;

			const embed = new EmbedBuilder()
				.setColor("Blue")
				.setTitle(`${interaction.guild.name}'s XP Leaderboard:`)
				.setDescription(`\`\`\`${text}\`\`\``)
				.setTimestamp()
				.setFooter({ text: "XP Leaderboard" });

			interaction.editReply({ embeds: [embed] });
		}
	},
};
