const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const page = require('discord-pagination-advanced');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help"),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

            const pages = [], cmds = interaction.client.commands.toJSON(), max = 15;

            for (let i = 0; i < cmds.length; i++) {
                const ind = Math.floor(i / max),
                    string = `\`${i + 1}.\` </${cmds[i].data.name + "\n" + cmds[i].data.description}`;

                pages[ind] ? pages[ind].data.description += `\n\n${string}` : pages[ind] = new EmbedBuilder()
                    .setTitle("📋 Help Menu")
                    .setDescription(string)
                    .setColor("Random")
                    .setFooter({ text: `${interaction.client.user.username}'s commands` })
            }

            page(interaction, pages, { deleteMessage: false })
        }
    
}