const { Events, EmbedBuilder } = require('discord.js')
const log = require('../models/deletemsglog.js')

module.exports = {
	name: Events.MessageDelete,
	async execute (message) {

		if (!message.guild || !message.author || message.author.bot || !message) return;

		var data = await log.findOne({ Guild: message.guild.id })
		if (!data) return;

		var sendChannel = await message.guild.channels.fetch(data.Channel);
		var attachments = await message.attachments.map(attachment => attachment.url);
		var member = message.author;
		var deleteTime = `<t:${Math.floor(Date.now() / 1000)}:R>`;

		const embed = new EmbedBuilder()
		.setTitle(`⚠ New Message Deleted!`)
		.setDescription(`This message was deleted ${deleteTime} and is being logged for moderation purposes.`)
		.setFooter({ text: `Deleted Message Logging System` })
		.setColor('Blue')
		.addFields({ name: "Message Content", value: `> ${message.content || "No Message Content"}` })
		.addFields({ name: "Message Author", value: `> \`${member.username} (${member.id})\`` })
		.addFields({ name: "Message Channel", value: `> ${message.channel} (${message.channel.id})` })
		.setTimestamp();

		if (attachments.length > 0) {
			embed.addFields({ name: "Message Attachments", value: attachments.join(` , `)})
		}

		await sendChannel.send({ embeds: [embed] });
	}
}