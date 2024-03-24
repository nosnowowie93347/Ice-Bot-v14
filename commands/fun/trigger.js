const { EmbedBuilder, SlashCommandBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js')
const trigger = require('../../models/trigger')

module.exports = {
	cooldown: 15,
	data: new SlashCommandBuilder()
	.setName('trigger')
	.setDescription('Setup the triggered response system in this guild')
	.setDMPermission(false)
	.addSubcommand(command => command.setName('add').setDescription('Add a word/phrase, and a trigger response').addStringOption(option => option.setName('phrase').setDescription('Phrase to reply to').setRequired(true)).addStringOption(option => option.setName('reply').setDescription('new reply').setRequired(true)))
	.addSubcommand(command => command.setName('remove').setDescription('Remove a word/phrase, and a trigger response').addStringOption(option => option.setName('phrase').setDescription("The exact phrase to remove").setRequired(true)))
	.addSubcommand(command => command.setName('check').setDescription('Check all trigger phrases'))
	.addSubcommand(command => command.setName('edit').setDescription("edit a trigger").addStringOption(option => option.setName('phrase').setDescription("the phrase to edit").setRequired(true)).addStringOption(option => option.setName('new-reply').setDescription('the new reply to the phrase')).addChannelOption(option => option.setName('block-channel').setDescription('Block a channel'))),
	async execute (interaction) {
		const sub = interaction.options.getSubcommand();
		async function sendMessage (message) {
			const embed = new EmbedBuilder()
			.setColor('#00ff00')
			.setDescription(message)

			await interaction.reply({ embeds: [embed], ephemeral: true })
		}

		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await sendMessage(`❌ You do not have permission to use this command!`);

		var globalData = await trigger.find({ Guild: interaction.guild.id });
		var data;
		var phrase;
		switch (sub) {
		case "add":
			phrase = interaction.options.getString('phrase').toLowerCase();
			const reply = interaction.options.getString('reply')
			data = await trigger.findOne({ Guild: interaction.guild.id, Phrase: phrase });
			if (data) {
				return await sendMessage(`⚠ It looks like \`${phrase}\` is already a trigger here!`) 
			} else {
				await trigger.create({
					Guild: interaction.guild.id,
					Phrase: phrase,
					Reply: reply,
				});
				
				await sendMessage(`🌎 I have added \`${reply}\` as a reply to all messages containing \`${phrase}\`! Feel free to block this in specific channels`);
			}
			break;
		case 'remove':
			phrase = interaction.options.getString('phrase').toLowerCase();
			data = await trigger.findOne({ Guild: interaction.guild.id, Phrase: phrase });

			if (!data) return await sendMessage(`⚠ Looks like \`${phrase}\` is not an exact match to one of the phrase replies! Caps do not make a difference, only characters & spaces do.`);
			else {
				await trigger.deleteOne({ Guild: interaction.guild.id, Phrase: phrase });
				await sendMessage(`🌎 I have deleted \`${phrase}\` from our trigger reply database.`)
			}
			break;
		case 'edit':
			phrase = interaction.options.getString('phrase').toLowerCase();
			data = await trigger.findOne({ Guild: interaction.guild.id, Phrase: phrase });
			var newReply = interaction.options.getString('new-reply') || data.Reply;
			var blockChannel = interaction.options.getChannel('block-channel')

			if (!data) return await sendMessage(`⚠ Looks like \`${phrase}\` is not an exact match to one of the phrase replies! Caps do not make a difference, only characters & spaces do.`);
			else {
				var update;
				if (blockChannel) {
					update = {
						$set: { Reply: newReply },
						$push: { Block: `${blockChannel.id}` }
					};
				} else {
					update = {
						$set: { Reply: newReply },
					}
				}

				await trigger.updateOne({ Guild: interaction.guild.id, Phrase: phrase }, update);
				await sendMessage(`🌎 I have updated your trigger with your changes`);
			}
			break;
		case 'check':
			if (globalData) {
				var information = []
				await globalData.forEach(async value => {
					var blocked = value.Block
					if (blocked.length == 0) blocked = 'No blocked channels';
					else blocked = value.Blocked.join(', ');

					information.push(`**Trigger Phrase** (lowercase format): \`${value.Phrase}\`\n**Reply Phrase** \`${value.Reply}\`\n**Blocked Channels** \`${blocked}\`\n\n`);

					await sendMessage(`🌎 **Your trigger messages and data**\n\n${information.join('\n')}`);
				})
			}
		}
	}
}