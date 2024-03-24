const { token, MONGODB_URI } = require("./config.json");
const cowsay = require("cowsay");
const chalk = require('chalk');
const process = require("node:process");
const mongoose = require("mongoose");
const {
	ButtonBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
	AuditLogEvent,
	ActionRowBuilder,
	ButtonStyle,
	ComponentType,
	ChannelType,
	Client,
	ActivityType,
	Events,
	DMChannel,
	Partials,
	PermissionsBitField,
	GatewayIntentBits,
	Collection,
} = require("discord.js");
const fs = require("node:fs");
const reactions = require("./models/reactionrs");
const path = require("node:path");
const axios = require("axios");
const client = new Client({
	intents:
		[GatewayIntentBits.Guilds] |
		[GatewayIntentBits.GuildInvites] |
		[GatewayIntentBits.GuildBans] |
		[GatewayIntentBits.GuildModeration] |
		[GatewayIntentBits.DirectMessages] |
		[GatewayIntentBits.GuildMembers] |
		[GatewayIntentBits.GuildEmojisAndStickers] |
		[GatewayIntentBits.GuildPresences] |
		[GatewayIntentBits.GuildMessageReactions] |
		[GatewayIntentBits.MessageContent] |
		[GatewayIntentBits.GuildMessages],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
client.once(Events.ClientReady, (c) => {
	mongoose.set("strictQuery", false);
	mongoose.connect(MONGODB_URI);
	console.log(
		cowsay.say({
			text: "Connected to Database",
			e: "oO",
			T: "U ",
		}),
	);
	let status = [
		{
			name: "Stuff and things",
			type: ActivityType.Streaming,
			url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		},
		{
			name: "Stranger Things",
			type: ActivityType.Watching,
		},
		{
			name: "Fallout 4",
			type: ActivityType.Playing,
		},
		{
			name: "Spotify",
			type: ActivityType.Listening,
		},
	];
	console.log(
		cowsay.say({
			text: `Logged in as ${c.user.tag}`,
			e: "oO",
			T: "U ",
		}),
	);

	setInterval(() => {
		let random = Math.floor(Math.random() * status.length);
		client.user.setActivity(status[random]);
	}, 25000);
});
process.on("unhandledRejection", async (reason, promise) => {
	console.log(chalk.redBright("Error!: Unhandled Rejection at:"), promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
	console.log(chalk.redBright("Uncaught exception: "), err);
});
const counting = require("./models/countingschema");
client.on(Events.MessageCreate, async (message) => {
	if (!message.guild) return;
	if (message.author.bot) return;

	const data = await counting.findOne({
		Guild: message.guild.id,
	});
	if (!data) return;
	else {
		if (message.channel.id !== data.Channel) return;
		const number = Number(message.content);

		if (number !== data.Number) {
			return message.react("❌");
		} else if (data.LastUser === message.author.id) {
			message.react("❌");
			await message.reply(`Someone else has to count that number!`);
		} else {
			await message.react("✅");

			data.LastUser = message.author.id;
			data.Number++;
			await data.save();
		}
	}
});
client.on(Events.ChannelDelete, async channel => {
	channel.guild.fetchAuditLogs({
		type: AuditLogEvent.ChannelDelete,
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = channel.name;
		const id = channel.id;
		let type = channel.type;

		if (type == 0) type = "Text";
		if (type == 2) type = "Voice";
		if (type == 13) type = 'Stage';
		if (type == 5) type = "Category";
		const logchannel = channel.guild.channels.cache.find(channel => channel.name === 'logs' || channel.name === 'modlogs');
		let owner = await channel.guild.fetchOwner();
		const embed = new EmbedBuilder()
		
		.setAuthor({ name: `${owner.user.username}` })
		.setColor("#dc143c")
		.setTitle(`🛠 Channel Deleted!`)
		.setTimestamp()
		.addFields({ name: "Channel Name", value: `\`${name}\``, inline: false })
		.addFields({ name: "Channel Type", value: `\`${type}\``, inline: false })
		.addFields({ name: "Channel ID", value: `\`${id}\``, inline: false })
		.addFields({ name: "Deleted By", value: `\`${executor.tag}\``, inline: false })
		.setFooter({ text: `⚙ Mod Logging System` })

		logchannel.send({ embeds: [embed] })
	})
});
client.on(Events.ChannelCreate, async channel => {
	channel.guild.fetchAuditLogs({
		type: AuditLogEvent.ChannelCreate,
	})
	.then(async audit => {
		const { executor } = audit.entries.first()

		const name = channel.name;
		const id = channel.id;
		let type = channel.type;

		if (type == 0) type = "Text";
		if (type == 2) type = "Voice";
		if (type == 13) type = 'Stage';
		if (type == 5) type = "Category";
		const logchannel = channel.guild.channels.cache.find(channel => channel.name === 'logs' || channel.name === 'modlogs');
		let owner = await channel.guild.fetchOwner();
		const embed = new EmbedBuilder()
		
		.setAuthor({ name: `${owner.user.username}` })
		.setColor("#dc143c")
		.setTitle(`🛠 Channel Created!`)
		.setTimestamp()
		.addFields({ name: "Channel Name", value: `\`${name}\``, inline: false })
		.addFields({ name: "Channel Type", value: `\`${type}\``, inline: false })
		.addFields({ name: "Channel ID", value: `\`${id}\``, inline: false })
		.addFields({ name: "Created By", value: `\`${executor.tag}\``, inline: false })
		.setFooter({ text: `⚙ Mod Logging System` })

		logchannel.send({ embeds: [embed] })
	})
});
client.on(Events.GuildBanAdd, (ban) => {
	const embed = new EmbedBuilder()
		.setTitle("<:banhammer:1207101783340621877> Member Banned.")
		.setColor("#dc143c")
		.setAuthor({
			name: client.user.tag,
			iconURL: client.user.avatarURL({ dynamic: true }),
		})
		.setDescription(`Member ${ban.user} banned for ${ban.reason}`)
		.setFooter({ text: `Requested by: ${client.user.tag}` })
		.setThumbnail(ban.guild.iconURL())
		.setTimestamp();
	let channel = ban.guild.channels.cache.find(
		(channel) => channel.name === "logs",
	);

	channel.send({ embeds: [embed] });
	ban.user.send({
		content: `You have been banned from ${ban.guild} for ${ban.reason}.\nShould have behaved yourself, you silly goose!`,
	});
});
client.on(Events.InteractionCreate, async (interaction) => {
	const blacklist = require('./models/blacklist')
	const data = await blacklist.findOne({ User: interaction.user.id })

	if (data) return await interaction.reply(`You have been blacklisted! You cannot use this bot!`);
	if (!interaction.isModalSubmit) return;
	if (interaction.customId === "bugreport") {
		const command = interaction.fields.getTextInputValue("command");
		const description = interaction.fields.getTextInputValue("description");
		const id = interaction.user.id;
		const member = interaction.member;
		const server = interaction.guild.id || `no server provided`;
		const channel = client.channels.cache.get("986737676550029322");

		const embed = new EmbedBuilder()
			.setColor("LuminousVividPink")
			.setTitle(`Report from ${member.user.username}`)
			.addFields({
				name: "User ID",
				value: `${id}`,
			})
			.addFields({
				name: "Member",
				value: `${member}`,
			})
			.addFields({
				name: "Server ID",
				value: `${server}`,
			})
			.addFields({
				name: "Command Reported",
				value: `${command}`,
			})
			.addFields({
				name: "Report Description",
				value: `${description}`,
			})
			.setTimestamp()
			.setFooter({ text: `Report System` });
		channel.send({ embeds: [embed] }).catch((err) => {});
		interaction.reply({ content: `Report submitted.`, ephemeral: true });
	}
	if (!interaction.isChatInputCommand()) return;

	let command = client.commands.get(interaction.commandName);
	const { cooldowns } = interaction.client;
	//cooldown
	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}


	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime =
			timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return interaction.reply({
				content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
				ephemeral: true,
			});
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
	if (!command) return;
	//error handle
	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: `There was an error while executing this command`,
			ephemeral: true
		}).catch(err => {});

		//error flag system
		var guild = interaction.guild;
		var member = interaction.member;
		var channel = interaction.channel;
		var errorTime = `<t:${Math.floor(Date.now() / 1000)}:R>`;

		const sendChannel = await client.channels.fetch('986737674574508063')
		const embed = new EmbedBuilder()
		.setColor("#ff00ff")
		.setDescription(`An error has been detected.`)
		.addFields({ name: `Error Command`, value: `\`${interaction.commandName}\``})
		.addFields({ name: `Error Stack`, value: `\`${error.stack}\``})
		.addFields({ name: `Error Message`, value: `\`${error.message}\``})
		.addFields({ name: `Error Timestamp`, value: `${errorTime}`})
		.setFooter({ text: `Error Logging System` })
		.setTimestamp()

		const button = new ButtonBuilder()
		.setCustomId('fetchErrorUserInfo')
		.setLabel(`📩 Fetch User Info`)
		.setStyle(ButtonStyle.Danger)

		const row = new ActionRowBuilder()
		.addComponents(button)

		const msg = await sendChannel.send({ embeds: [embed], components: [row] }).catch(err => {});

		var time = 300000;
		const collector = await msg.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time
		});

		collector.on('collect', async i => {
			if (i.customId == 'fetchErrorUserInfo') {
				const userEmbed = new EmbedBuilder()
				.setColor("#ff00ff")
				.setDescription("This user has triggered an error")
				.addFields({ name: `Error Guild`, value: `\`${guild.name} (${guild.id})\``})
				.addFields({ name: `Error User`, value: `\`${member.user.username} (${member.id})\``})
				.addFields({ name: `Error Command Channel`, value: `\`${channel.name} (${channel.id})\``})
				.setTimestamp()

				await i.reply({ embeds: [userEmbed], ephemeral: true })
			}
		})

		collector.on('end', async () => {
			button.setDisabled(true)
			embed.setFooter({ text: 'Error Logging System - your user button is now expired' })
			await msg.edit({ embeds: [embed], components: [row] })
		})
	}
});

client.on(Events.Error, (error) => {
	console.error(chalk.redBright(`An error has occured: `), `${error}`);
});
client.on(Events.GuildCreate, (guild) => {
	// This event triggers when the bot joins a guild.
	console.log(chalk.blue(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`));
});
client.on(Events.MessageReactionAdd, async (reaction, user) => {
	if (!reaction.message.guildId) return;
	if (user.bot) return;

	let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
	if (!reaction.emoji.id) cID = reaction.emoji.name;

	const data = await reactions.findOne({
		Guild: reaction.message.guildId,
		Message: reaction.message.id,
		Emoji: cID,
	});
	if (!data) return;

	const guild = await client.guilds.cache.get(reaction.message.guildId);
	const member = await guild.members.cache.get(user.id);

	try {
		await member.roles.add(data.Role);
	} catch (e) {
		console.log(`ERROR: ${e}`);
		return;
	}
});
client.on(Events.MessageReactionRemove, async (reaction, user) => {
	if (!reaction.message.guildId) return;
	if (user.bot) return;

	let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
	if (!reaction.emoji.id) cID = reaction.emoji.name;

	const data = await reactions.findOne({
		Guild: reaction.message.guildId,
		Message: reaction.message.id,
		Emoji: cID,
	});
	if (!data) return;

	const guild = await client.guilds.cache.get(reaction.message.guildId);
	const member = await guild.members.cache.get(user.id);

	try {
		await member.roles.remove(data.Role);
	} catch (e) {
		console.log(`ERROR: ${e}`);
		return;
	}
});
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
	if (oldMessage.mentions.users.first()) {
		const embed = new EmbedBuilder()
			.setTitle("Ghost Ping")
			.setDescription(
				`${
					oldMessage.author.tag
				} ghost pinged ${oldMessage.mentions.users.first()}`,
			);
		return oldMessage.channel.send(embed);
	}
});
client.login(token);
