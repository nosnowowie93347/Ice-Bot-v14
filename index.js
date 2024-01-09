const { token } = require('./config.json');
const { Client, ActivityType, Events, EmbedBuilder, GatewayIntentBits, Collection } = require('discord.js');
const fs = require("node:fs")
const path = require("node:path")

const client = new Client ({ intents: [GatewayIntentBits.Guilds] | [GatewayIntentBits.GuildMembers] | [GatewayIntentBits.MessageContent] | [GatewayIntentBits.GuildMessages]});

const eventsPath = path.join(__dirname, "events")
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for(const file of eventFiles) {
	const filePath = path.join(eventsPath, file)
	const event = require(filePath);
	if(event.once) {
		client.once(event.name, (...arge) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}



client.commands = getCommands('./commands');

client.once(Events.ClientReady, c => {
	let status = [
	{
		name: "Stuff and things",
		type: ActivityType.Streaming,
		url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
	},
	{
		name: "Stranger Things",
		type: ActivityType.Watching
	},
	{
		name: "Fallout 4",
		type: ActivityType.Playing
	},
	{
		name: "Spotify",
		type: ActivityType.Listening
	}
	]
	console.log(`Logged in as ${c.user.tag}`);

	setInterval(() => {
		let random = Math.floor(Math.random() * status.length);
		client.user.setActivity(status[random]);
	}, 25000);
});

client.on(Events.InteractionCreate, (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	
	let command = client.commands.get(interaction.commandName);

	try{
		if(interaction.replied) return;
		command.execute(interaction);
	} catch (error){
		console.error(error);
	}
});
client.on(Events.Error, error => {
  console.error(`An error has occured: ${error}`)
});
client.on(Events.GuildCreate, guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on(Events.MessageUpdate, async(oldMessage, newMessage) => {
   
    if(oldMessage.mentions.users.first()) {
        const embed = new EmbedBuilder()
        .setTitle("Ghost Ping")
        .setDescription(`${oldMessage.author.tag} ghost pinged ${oldMessage.mentions.users.first()}`)
        return oldMessage.channel.send(embed)
    }

})
client.login(token);


function getCommands(dir) {
	let commands = new Collection();
	const commandFiles = getFiles(dir);
	for(const commandFile of commandFiles) {
		const command = require(commandFile);
		commands.set(command.data.toJSON().name, command);
	}
	return commands;
}


function getFiles(dir) {
	const files = fs.readdirSync(dir, {
	withFileTypes: true
	});
	let commandFiles = [];

	for(const file of files) {
		if(file.isDirectory()){
			commandFiles = [
				...commandFiles,
				...getFiles(`${dir}/${file.name}`)
			]
		} else if (file.name.endsWith(".js")) {
			commandFiles.push(`${dir}/${file.name}`);
		}
	}
	return commandFiles;
}