const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName("lfg")
		.setDescription("look for a video game group")
		.addStringOption((option) =>
			option
				.setName("game")
				.setDescription("name of the game to search")
				.setRequired(true),
		),
	async execute(interaction) {
		const game = interaction.options.getString("game");
		const members = await interaction.guild.members.fetch();
		console.log(members.size);
		var group = [];
		await members.forEach(async (member) => {
			if (!member.presence || !member.presence.activities[0]) return;

			var currentGame = await member.presence.activities[0].name;
			console.log(currentGame);

			if (currentGame.toLowerCase() == game.toLowerCase()) {
				group.push({ member: member.id, game: currentGame });
			} else {
				return;
			}
		});

		group = group.slice(0, 2000);

		const embed = new EmbedBuilder().setColor("DarkVividPink");
		console.log(group);
		var string;
		await group.forEach(async (value) => {
			const member = await interaction.guild.members.cache.get(
				value.member,
			);
			string += `Member: **${member.user.username}** (${value.member}) is on ${value.game}!\n`;
		});

		if (string) {
			console.log(string);
			string = string.replace("undefined", " ");

			embed
				.setTitle(`Members playing \`${game}\``)
				.setDescription(string);
		} else {
			embed.setDescription(`Looks like no one is playing \`${game}\``);
		}

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
