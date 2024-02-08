const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require("discord.js");

module.exports = {
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName("serverlist")
		.setDescription("Get a list of the servers this bot is in"),
	async execute(interaction) {
		async function sendMessage(message, key) {
			const embed = new EmbedBuilder()
				.setColor("LuminousVividPink")
				.setDescription(message);

			if (key) {
				const button = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setURL(`https://sourceb.in/${key}`)
						.setLabel(`Server List`),
				);

				await interaction.reply({
					embeds: [embed],
					components: [button],
				});
			} else {
				await interaction.reply({ embeds: [embed] });
			}
		}

		var content = `${interaction.client.user.username}'s Server List:\n\n`;
		var guilds = await interaction.client.guilds.fetch();
		await guilds.forEach(async (guild) => {
			content += `Server: ${guild.name}, ID: ${guild.id}\n`;
		});

		content += `If your bot is in more than 200 servers, only the first 200 will be shown`;

		var listBin = await fetch("https://sourceb.in/api/bins", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				files: [
					{
						content: content,
					},
				],
			}),
		});

		if (listBin.ok) {
			var { key } = await listBin.json();
			await sendMessage(
				`🌎 **My Server List:**\n\nI am currently in \`${interaction.client.guilds.cache.size}\` servers-- I have compiled this list into a bin below consisting of names and ids`,
				key,
			);
		} else {
			await sendMessage(`Failed to load server list.`);
		}
	},
};
