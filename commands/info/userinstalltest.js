module.exports = {
	cooldown: 10,
	data: {
	name: "userinstall",
	description: "User install command test",
	"integration_types": [1],
	"contexts": [0, 1, 2]
	},
	async execute (interaction) {
		await interaction.reply({ content: '🌐 Test successful!', ephemeral: true})
	}
}