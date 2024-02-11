const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionsBitField,
	ActionRowBuilder,
} = require("discord.js");
const modrole = require("../models/modrole");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("modrole")
		.setDescription("mod role")
		.addSubcommand((command) =>
			command
				.setName("add")
				.setDescription("Add a mod role to the database")
				.addRoleOption((option) =>
					option
						.setName("role")
						.setDescription("The role to add")
						.setRequired(true)
				)
		)
		.addSubcommand((command) =>
			command
				.setName("remove")
				.setDescription("Remove a mod role from the database")
				.addRoleOption((option) =>
					option
						.setName("role")
						.setDescription("role to remove")
						.setRequired(true)
				)
		)
		.addSubcommand((command) =>
			command.setName("check").setDescription("check the mod role(s)")
		),
	async execute(interaction) {
		const sub = interaction.options.getSubcommand();
		var data = await modrole.find({ Guild: interaction.guild.id });

		async function sendMessage(message) {
			const embed = new EmbedBuilder()
				.setColor("Random")
				.setDescription(message);

			await interaction.reply({ embeds: [embed] });
		}

		async function checkData(add) {
			var check;
			var role = interaction.options.getRole("role");

			await data.forEach(async (value) => {
				if (value.Role == role.id) return (check = true);
			});
			return check;
		}

		if (
			!interaction.member.permissions.has(
				PermissionsBitField.Administrator
			)
		)
			return await interaction.reply(
				"You don't have permission to use this command!"
			);

		switch (sub) {
			case "add":
				var check = await checkData(true);
				var role = interaction.options.getRole("role");

				if (check) {
					return await sendMessage(`This is already a mod role`);
				} else {
					await modrole.create({
						Guild: interaction.guild.id,
						Role: role.id,
					});

					return await sendMessage(
						`Role ${role.name} added to modroles`
					);
				}
				break;
			case "remove":
				var check = await checkData();
				var role = interaction.options.getRole("role");

				if (!check) {
					return await sendMessage(`That role is not a modrole`);
				} else {
					await modrole.deleteOne({
						Guild: interaction.guild.id,
						Role: role.id,
					});
					await sendMessage(
						`Role ${role.name} removed from modroles`
					);
				}
				break;
			case "check":
				var values = [];
				await data.forEach(async (value) => {
					if (!value.Role) return;
					else {
						var r = await interaction.guild.roles.cache.get(
							value.Role
						);
						values.push(
							`**Role Name:** ${r.name}\n**Role ID:** ${r.id}`
						);
					}
				});

				if (values.length > 0) {
					await sendMessage(`**Mod Roles**\n\n${values.join("\n")}`);
				} else {
					await sendMessage(`No modroles`);
				}
		}
	},
};
