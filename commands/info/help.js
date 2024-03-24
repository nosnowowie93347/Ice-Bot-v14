const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const page = require("discord-pagination-advanced");

module.exports = {
    cooldown: 30,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Lists the bot's commands"),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });

            const pages = [],
                cmds = interaction.client.commands.toJSON(),
                max = 10;

            for (let i = 0; i < cmds.length; i++) {
                const ind = Math.floor(i / max),
                    string = `\`${i + 1}.\` </${cmds[i].data.name + ":" + cmds[i].id}>\n> ${cmds[i].data.description}`;

                pages[ind]
                    ? (pages[ind].data.description += `\n\n${string}`)
                    : (pages[ind] = new EmbedBuilder()
                          .setTitle("📋 Help Menu")
                          .setDescription(string)
                          .setColor("Random"));
            }

            page(interaction, pages, { deleteMessage: false });
        }
    };
