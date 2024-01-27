const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = {
	name: "messageCreate",
	async execute(message, client) {
		async function sendMessage(reply) {
			const embed = new EmbedBuilder()
				.setTimestamp()
				.setColor("Blurple")
				.setTitle(`Want to use me?`)
				.setDescription(
					`Run my /help command to get started! I have many different features.`,
				);

			if (!reply) {
				await message.reply({ embeds: [embed] });
			} else {
				embed.setFooter({
					text: `If this message was sent by mistake, click the delete icon.`,
				});

				const button = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId(`replymsgDelete`)
						.setLabel(`🗑️`)
						.setStyle(ButtonStyle.Danger),
				);

				const msg = await message.reply({
					embeds: [embed],
					components: [button],
				});
				const collector = await msg.createMessageComponentCollector();
				collector.on("collect", async (i) => {
					if (i.customId == "replymsgDelete") {
						await message.delete();
					}
				});
			}
		}

		if (message.mentions.users.first() == message.client.user) {
			if (message.reference) {
				await sendMessage(true);
			} else {
				await sendMessage();
			}
		}
	},
};
