const { token, MONGODB_URI } = require("./config.json");
const cowsay = require("cowsay");
const process = require("node:process");
const mongoose = require("mongoose");
const {
	Client,
	ActivityType,
	Events,
	DMChannel,
	ChannelType,
	Partials,
	PermissionsBitField,
	EmbedBuilder,
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
		client.once(event.name, (...arge) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = getCommands("./commands");
client.cooldowns = new Collection();

client.once(Events.ClientReady, (c) => {
	mongoose.set("strictQuery", false);
	mongoose.connect(MONGODB_URI);
	console.log(
		cowsay.say({
			text: "Connected to Database",
			e: "oO",
			T: "U ",
		})
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
			f: "dragon-and-cow",
		})
	);

	setInterval(() => {
		let random = Math.floor(Math.random() * status.length);
		client.user.setActivity(status[random]);
	}, 25000);
});

process.on("uncaughtException", (err) => {
	console.log("Uncaught exception: ", err);
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
client.on(Events.InteractionCreate, (interaction) => {
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
	//modrole
	if (command.mod) {
		var modRoleData = modrole.find({ Guild: interaction.guild.id });
		if (modRoleData.length > 0) {
			var check;
			modRoleData.forEach((value) => {
				const mRoles = interaction.member.roles.cache.map(
					(role) => role.id
				);
				mRoles.forEach((value) => {
					if (role == value.Role) check = true;
				});
			});

			if (!check)
				return interaction.reply(
					`Only **moderators** can use this command.`
				);
		}
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
	try {
		if (interaction.replied) return;
		command.execute(interaction);
	} catch (error) {
		console.error(error);
	}

	const channel = client.channels.cache.get("986737674574508063");
	const server = interaction.guild.name;
	const user = interaction.user.username;
	const userID = interaction.user.id;

	const thisembed = new EmbedBuilder()
		.setColor("DarkVividPink")
		.setTitle(`Command Used! `)
		.addFields({
			name: `Server Name`,
			value: `${server}`,
		})
		.addFields({
			name: `Command`,
			value: `${interaction}`,
		})
		.addFields({
			name: `User`,
			value: `${user} / ${userID}`,
		})
		.setTimestamp()
		.setFooter({ text: `Command Executed` });

	channel.send({ embeds: [thisembed] });
});

client.on(Events.Error, (error) => {
	console.error(`An error has occured: ${error}`);
});
client.on(Events.GuildCreate, (guild) => {
	// This event triggers when the bot joins a guild.
	console.log(
		`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
	);
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
				} ghost pinged ${oldMessage.mentions.users.first()}`
			);
		return oldMessage.channel.send(embed);
	}
});
client.login(token);
function getFiles(dir) {
	const files = fs.readdirSync(dir, {
		withFileTypes: true,
	});
	let commandFiles = [];

	for (const file of files) {
		if (file.isDirectory()) {
			commandFiles = [
				...commandFiles,
				...getFiles(`${dir}/${file.name}`),
			];
		} else if (file.name.endsWith(".js")) {
			commandFiles.push(`${dir}/${file.name}`);
		}
	}
	return commandFiles;
}

function getCommands(dir) {
	let commands = new Collection();
	const commandFiles = getFiles(dir);
	for (const commandFile of commandFiles) {
		const command = require(commandFile);
		commands.set(command.data.toJSON().name, command);
	}
	return commands;
}
