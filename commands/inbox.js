const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const inbox = require("../models/inbox");

module.exports = {
	cooldown: 20,
	mod: false,
	data: new SlashCommandBuilder()
		.setName("inbox")
		.setDescription("Get your inbox")
		.addSubcommand((command) =>
			command.setName("get").setDescription("Get inbox"),
		)
		.addSubcommand((command) =>
			command
				.setName("clear")
				.setDescription("clear inbox")
				.addStringOption((option) =>
					option
						.setName("id")
						.setDescription(
							"Id of message to clear. Type 'all' to clear all messages",
						)
						.setRequired(true),
				),
		),
	async execute(interaction) {
		const sub = interaction.options.getSubcommand();
		var data = await inbox.find({ User: interaction.user.id });

		async function sendMessage(message) {
			const embed = new EmbedBuilder()
				.setColor("#C40CD0")
				.setDescription(message)
				.setTimestamp();

			await interaction.reply({ embeds: [embed], ephemeral: true });
		}

		switch (sub) {
			case "get":
				if (data.length == 0) {
					await sendMessage("⚠ you have nothing in your inbox...");
				} else {
					var string = `📬 **Your Inbox**`;
					await data.forEach(async (value) => {
						string += `\n\n> Message Content: ${value.Message} (https://discord.com/channels/${value.Guild}/${value.Channel}/${value.ID}) | ID: \`${value.ID}\``;
					});

					if (string.length >= 2000)
						return await sendMessage(`⚠ Your inbox is too full!`);

					await sendMessage(string);
				}
				break;
			case "clear":
				const id = interaction.options.getString("id");
				if (data.length == 0)
					return await sendMessage(
						`⚠ You have nothing in your inbox...`,
					);

				if (id == "ALL") {
					await inbox.deleteMany({ User: interaction.user.id });
					await sendMessage(`🌎 I have cleared your inbox.`);
				} else {
					var checkData = await inbox.findOne({
						User: interaction.user.id,
						ID: id,
					});
					if (!checkData)
						return await sendMessage(
							`⚠ That ID does not exist in your inbox!`,
						);

					await inbox.deleteOne({
						User: interaction.user.id,
						ID: id,
					});
					await sendMessage(
						`🌎 I have deleted the message with the ID \`${id}\``,
					);
				}
		}
	},
};
