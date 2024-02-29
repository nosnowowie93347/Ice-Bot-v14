const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	cooldown: 20,
	data: new SlashCommandBuilder()
	.setName('invitelb')
	.setDescription(`Get the total --all time-- leaderboard for invites`),
	async execute (interaction) {
		const invites = await interaction.guild.invites.fetch()
		var members = await interaction.guild.members.fetch()

		async function total () {
			var userInvs = []
			await members.forEach(async member => {
				var uInvites = await invites.filter(u => u.inviter && u.inviter.id === member.user.id);
				var count = 0;
				await uInvites.forEach(async invite => count += invite.uses);
				userInvs.push({ member: member.user.id, invites: count })
			});

			return userInvs;
		}

		async function sendMessage (message) {
			const embed = new EmbedBuilder()
			.setTitle(`🍀 Invite Logger`)
			.setColor(`LuminousVividPink`)
			.setDescription(message)
			.setTimestamp()

			await interaction.reply({ embeds: [embed] })
		}

		var leaderboard = await total()
		leaderboard.sort((a, b) => b.invites - a.invites);
		var output = leaderboard.slice(0, 8);

		var string;
		var num = 1
		await output.forEach(async value => {
			var member = await interaction.guild.members.fetch(value.member)
			string += `#${num} Member: **${member.user.username}**, Total Invites: \`${value.invites}\`\n`;
			num++;
		});

		string = string.replace(`undefined`, '')

		await sendMessage(`🌍 **Total Invite Leaderboard** \n\n${string}`)
	}
}