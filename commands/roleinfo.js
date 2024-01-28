const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName("roleinfo")
		.setDescription("get info about a role")
		.addRoleOption((option) =>
			option
				.setName("role")
				.setDescription("the role to get info on")
				.setRequired(true),
		),
	async execute(interaction) {
		const role = interaction.options.getRole("role");
		const member = await interaction.guild.members.fetch();

		const name = role.name;
		const color = role.color;
		const icon = role.iconURL();
		const hoist = role.hoist;
		const id = role.id;
		const pos = role.rawPosition;
		const mention = role.mentionable;

		let count = [];
		await member.forEach(async (member) => {
			if (member._roles.includes(id)) {
				count++;
			}
		});

		const embed = new EmbedBuilder()
			.setColor("DarkVividPink")
			.setTitle("Role Info")
			.setThumbnail(icon)
			.addFields({ name: `Role Name`, value: `${name}`, inline: true })
			.addFields({ name: `Role Color`, value: `${color}`, inline: true })
			.addFields({ name: `Hoist`, value: `${hoist}`, inline: true })
			.addFields({ name: `Role ID`, value: `${id}`, inline: true })
			.addFields({ name: `Role Position`, value: `${pos}`, inline: true })
			.addFields({
				name: `Mentionable`,
				value: `${mention}`,
				inline: true,
			})
			.addFields({
				name: `Role Member Count`,
				value: `${count}`,
				inline: true,
			})
			.setFooter({
				text: `Requested by: ${interaction.user.tag}`,
				inline: true,
			})
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};
