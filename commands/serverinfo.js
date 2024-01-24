const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const osutils = require("os-utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Info about the server"),
    async execute(interaction) {
        const client = interaction.client;
        const guild = interaction.guild;
        const members = interaction.guild.members;

        const icon = interaction.guild.iconURL();
        const roles = interaction.guild.roles.cache.size;
        const emojis = interaction.guild.emojis.cache.size;
        const id = interaction.guild.id;

        let baseVerification = interaction.guild.VerificationLevel;

        if (baseVerification == 0) baseVerification = "None";
        if (baseVerification == 1) baseVerification = "Low";
        if (baseVerification == 2) baseVerification = "Medium";
        if (baseVerification == 3) baseVerification = "High";
        if (baseVerification == 4) baseVerification = "Very High";

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setThumbnail(icon)
            .setAuthor({ name: guild.name, iconURL: icon })
            .setFooter({ text: `Server ID: ${id}` })
            .setTimestamp()
            .addFields({
                name: "Name",
                value: `${interaction.guild.name}`,
                inline: false,
            })
            .addFields({
                name: "Date Created",
                value: `<t:${parseInt(guild.createdTimestamp / 1000)}:R> (Hover for complete date`,
                inline: true,
            })
            .addFields({
                name: "Server Members",
                value: `${guild.memberCount}`,
                inline: true,
            })
            .addFields({ name: `Roles`, value: `${roles}`, inline: true })
            .addFields({
                name: `Emoji Number`,
                value: `${emojis}`,
                inline: true,
            })
            .addFields({
                name: "Verification Level",
                value: `${interaction.guild.VerificationLevel}`,
                inline: true,
            })
            .addFields({
                name: "Server Owner",
                value: `${guild.ownerId}`,
                inline: true,
            });

        await interaction.reply({ embeds: [embed] });
    },
};
