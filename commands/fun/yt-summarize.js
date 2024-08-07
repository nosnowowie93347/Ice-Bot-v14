const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const puppeteer = require("puppeteer");

module.exports = {
  cooldown: 20,
  data: new SlashCommandBuilder()
    .setName("yt-summarize")
    .setDescription("Summarize a YT video")
    .addStringOption((option) =>
      option.setName("url").setDescription("Video URL").setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const url = interaction.options.getString("url");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://summarize.tech/");
    await page.waitForSelector(
      'input.me-auto.form-control[placeholder="URL of a YouTube video"]',
    );
    await page.type(
      'input.me-auto.form-control[placeholder="URL of a YouTube video"]',
      url,
    );

    await page.keyboard.press("Enter");
    await page.waitForSelector("section");

    var text = await page
      .evaluate((selector) => {
        const paragraph = document.querySelector(selector);
        return paragraph.textContent;
      }, "section > p:first-of-type")
      .catch((err) => {
        console.log(err);
      });

    if (!text)
      return await interaction.editReply(
        "This video doesn't have a transcript.",
      );

    text = text.replace("YouTube video", `[YouTube video](${url})`);

    await browser.close();

    const embed = new EmbedBuilder().setColor("Blurple").setDescription(text);

    await interaction.editReply({ embeds: [embed] });
  },
};
