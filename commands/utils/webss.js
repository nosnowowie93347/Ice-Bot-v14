const {
	EmbedBuilder,
	SlashCommandBuilder,
	AttachmentBuilder,
} = require("discord.js");
const puppeteer = require("puppeteer");

module.exports = {
	cooldown: 15,
	data: new SlashCommandBuilder()
		.setName("web-screenshot")
		.setDescription("Screenshot a website")
		.addStringOption((option) =>
			option
				.setName("website")
				.setDescription("Website to screenshot")
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const website = interaction.options.getString("website");

		try {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.goto(website);
			await page.setViewport({ width: 1920, height: 1080 });

			const screenshot = await page.screenshot();
			await browser.close();

			const buffer = Buffer.from(screenshot, "base64");
			const attachment = new AttachmentBuilder(buffer, {
				name: "image.png",
			});

			const embed = new EmbedBuilder()
				.setColor("Blurple")
				.setTimestamp()
				.setImage("attachment://image.png");

			await interaction.editReply({
				embeds: [embed],
				files: [attachment],
			});
		} catch (e) {
			await interaction.editReply({
				content: `⚠️ There was an error getting that screenshot - try again with a valid website.`,
			});
		}
	},
};
