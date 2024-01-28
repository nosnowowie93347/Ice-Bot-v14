const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const osutils = require("os-utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Info about the bot"),
    name: "botinfo",
    async execute(interaction) {
        const client = interaction.client;
        var milliseconds = parseInt((client.uptime % 1000) / 100),
            seconds = parseInt((client.uptime / 1000) % 60),
            minutes = parseInt((client.uptime / (1000 * 60)) % 60),
            hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24);
        days = parseInt((client.uptime / (1000 * 60 * 60 * 24)) % 60);
        days = days < 10 ? "0" + days : days;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        osutils.cpuUsage(function (v) {
            const embed = new EmbedBuilder()
                .setColor("#7289DA")
                .setThumbnail(
                    client.user.avatarURL({
                        format: "png",
                        dynamic: true,
                        size: 2048,
                    }),
                )
                .setURL(
                    client.user.avatarURL({
                        format: "png",
                        dynamic: true,
                        size: 2048,
                    }),
                )
                .setTimestamp()
                .addFields(
                    { name: "Ice Bot", value: "Show the bot's stats." },
                    {
                        name: "Total commands: ",
                        value: `${client.commands.size} commands`,
                        inline: true,
                    },
                    {
                        name: "Total Servers: ",
                        value: `${client.guilds.cache.size}`,
                        inline: true,
                    },
                    {
                        name: "Total Users: ",
                        value: `${client.users.cache.size}`,
                        inline: true,
                    },
                    { name: "Library: ", value: "Discord.js V14" },
                    {
                        name: "-------------------------------------------------------------------------------",
                        value: "----------------------------------------------------------------------------",
                    },
                    {
                        name: "Platform: ",
                        value: `${osutils.platform()}`,
                        inline: true,
                    },
                    {
                        name: "VPS CPU Cores: ",
                        value: `${osutils.cpuCount()}` + " Cores",
                        inline: true,
                    },
                    {
                        name: "Total Memory: ",
                        value:
                            `${osutils.totalmem().toString().split(".")[0]}` +
                            "." +
                            osutils
                                .totalmem()
                                .toString()
                                .split(".")[1]
                                .split("")[0] +
                            osutils
                                .totalmem()
                                .toString()
                                .split(".")[1]
                                .split("")[1] +
                            "MB",
                        inline: true,
                    },
                );
            interaction.reply({ embeds: [embed] });
        });
    },
};
