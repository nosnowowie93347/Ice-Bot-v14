const blacklist = require("../models/wordBlacklist");
module.exports = {
	name: "messageCreate",
	async execute(message) {
		const data = await blacklist.findOne({ guildid: message.guild.id });
		if (!data) {
			data = await blacklist.create({ guildid: message.guild.id });
		}
		if (data.words.some((x) => message.content.toLowerCase().includes(x))) {
			await message.delete();
			await message.channel.send({
				content: `Watch your mouth, boy or girl!`,
			});
		}
	},
};
