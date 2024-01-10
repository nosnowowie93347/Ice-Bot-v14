const moment = require("moment");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("year")
        .setDescription("Amount of time until next year"),
    async execute(interaction) {
        const now = new Date();
        const next = new Date(now);
        next.setFullYear(now.getFullYear() + 1);
        next.setHours(0, 0, 0, 0);
        next.setMonth(0, 1);
        const duration = next - now;
        const seconds = Math.floor((duration / 1000) % 60);
        const minutes = Math.floor((duration / 1000 / 60) % 60);
        const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        const days = Math.floor(duration / (1000 * 60 * 60 * 24));

        const embed = new EmbedBuilder()
            .setColor("#398748")
            .setDescription(
                `There are **${days} days**, **${hours} hours**, **${minutes} minutes** and **${seconds} seconds** until **${next.getFullYear()}**!`
            )
        interaction.reply({ embeds: [embed] });
    },
};
