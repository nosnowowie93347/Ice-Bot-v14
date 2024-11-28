const {
	Client,
	ActivityType,
	DMChannel,
	Partials,
	PermissionsBitField,
	Events,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	GatewayIntentBits,
	Collection,
} = require("discord.js");
const fs = require("fs").promises;
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
	const configFileContent = await fs.readFile(
        `${process.cwd()}/config.json`,
        "utf8"
      );
      const config = JSON.parse(configFileContent);
	var sendGuild = await interaction.client.guilds.fetch(config.guildId)
	var channel = await sendGuild.channels.fetch("1270850687257018459");

	var server = interaction.guild.name;
	var channelofuse = interaction.channel;
	var user = interaction.user.username;
	var userID = interaction.user.id;
	if (!interaction.commandName) return;
	const thisembed = new EmbedBuilder()
		.setColor("DarkVividPink")
		.setTitle(`Command Used! `)
		.addFields({
			name: `Command`,
			value: `\`${interaction}\``,
		})
		.addFields({
			name: `Guild of Use`,
			value: `\`${server}\``,
		})
		.addFields({
			name: `Channel of Use`,
			value: `\`${channelofuse.name}\` (${channelofuse.id})`,
		})
		.addFields({
			name: `User`,
			value: `\`${user}\` / ${userID}`,
		})
		.setTimestamp()
		.setFooter({ text: `Interaction Use Logger` });
		const button = new ButtonBuilder()
		.setStyle(ButtonStyle.Danger)
		.setCustomId(`generateInviteLog`)
		.setLabel(`📬 Generate Server Invite`)

		const buttons = new ActionRowBuilder()
		.addComponents(
			button
		);

	var msg = await channel.send({ embeds: [thisembed], components: [buttons] });
	var time = 300000;
	const collector = await msg.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time
	});


	collector.on("collect", async i => {
		if (i.customId == 'generateInviteLog') {
			var invite = await channelofuse.createInvite()
			i.reply({ content: `🌍 Here is an invite to the channel of use: https://discord.gg/${invite.code}`, ephemeral: true })
		}
	});

	collector.on("end", async () => {
		button.setDisabled(true)
		await msg.edit({ embeds: [thisembed], components: [buttons] })
	});
	}
}