const { Discord, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const got = require("got");

module.exports = {
	cooldown: 15,
	data: new SlashCommandBuilder()
		.setName("meme")
		.setDescription("Gets a meme"),
	async execute(interaction) {
		await interaction.deferReply();
		const embed = new EmbedBuilder();
		got("https://www.reddit.com/r/memes/random/.json", {
			timeout: 9000,
		})
			.then((response) => {
				const [list] = JSON.parse(response.body);
				const [post] = list.data.children;

				const permalink = post.data.permalink;
				const memeUrl = `https://reddit.com${permalink}`;
				const memeImage = post.data.url;
				const memeTitle = post.data.title;
				const memeUpvotes = post.data.ups;
				const memeNumComments = post.data.num_comments;

				embed.setTitle(`${memeTitle}`);
				embed.setURL(`${memeUrl}`);
				embed.setColor("Random");
				embed.setImage(memeImage);
				embed.setFooter({
					text: `👍 ${memeUpvotes} 💬 ${memeNumComments}`,
				});

				interaction.editReply({ embeds: [embed] });
			})
			.catch(console.error);
	},
};
