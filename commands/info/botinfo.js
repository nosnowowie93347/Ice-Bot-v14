const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const osutils = require("os-utils");

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDMPermission(false)
        .setDescription("Info about the bot"),
    async execute(interaction) {
        const client = interaction.client;

        // Calculate the exact timestamp when the bot started up
        const readyTimestamp = Math.floor((Date.now() - client.uptime) / 1000);

        // Fetch CPU usage asynchronously from os-utils
        osutils.cpuUsage(async (v) => {
            const totalMem = osutils.totalmem();
            const freeMem = osutils.freemem();
            const usedMem = totalMem - freeMem;
            const memPercentage = (100 - osutils.freememPercentage() * 100).toFixed(2);
            
            const botMemUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            const cpuUsagePercent = (v * 100).toFixed(2);

            // Get bot avatar URL safely
            const avatarUrl = client.user.displayAvatarURL({ extension: "png", size: 2048 });

            const embed = new EmbedBuilder()
                .setColor("#7289DA")
                .setTitle("Ice Bot Stats")
                .setDescription("Show the bot's real-time performance and status.")
                .setThumbnail(avatarUrl)
                .setTimestamp()
                .addFields(
                    {
                        name: "Total Commands",
                        value: `${client.commands.size} commands`,
                        inline: true,
                    },
                    {
                        name: "Total Servers",
                        value: `${client.guilds.cache.size}`,
                        inline: true,
                    },
                    {
                        name: "Total Users",
                        value: `${client.users.cache.size}`,
                        inline: true,
                    },
                    {
                        name: "Uptime",
                        value: `Online since <t:${readyTimestamp}:F> (<t:${readyTimestamp}:R>)`,
                        inline: false,
                    },
                    {
                        name: "Library",
                        value: "Discord.js V14",
                        inline: true,
                    },
                    {
                        name: "Platform",
                        value: `${osutils.platform()}`,
                        inline: true,
                    },
                    {
                        name: "VPS CPU Cores",
                        value: `${osutils.cpuCount()} Cores`,
                        inline: true,
                    },
                    {
                        name: "VPS RAM Usage",
                        value: `${usedMem.toFixed(2)} / ${totalMem.toFixed(2)} MB`,
                        inline: true,
                    },
                    {
                        name: "VPS RAM %",
                        value: `${memPercentage}%`,
                        inline: true,
                    },
                    {
                        name: "Bot RAM Usage",
                        value: `${botMemUsage} MB`,
                        inline: true,
                    },
                    {
                        name: "CPU Usage",
                        value: `${cpuUsagePercent}%`,
                        inline: true,
                    }
                );

            // Acknowledge the interaction with the embed
            await interaction.reply({ embeds: [embed] });
        });
    },
};