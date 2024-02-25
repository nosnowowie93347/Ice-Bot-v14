const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes, PermissionFlagsBits } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

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

let commands = [];
const commandFiles = getFiles("./commands");

for (const file of commandFiles) {
	const command = require(file);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);
(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`,
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		});

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`,
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
