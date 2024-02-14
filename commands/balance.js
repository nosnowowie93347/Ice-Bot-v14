const User = require("../models/User");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 20,
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDMPermission(false)
        .setDescription("Check your balance or view another user's balance.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setRequired(false)
                .setDescription("user to check"),
        ),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });
        const member = interaction.options.getUser("user");
        const mention = member ? member.id : interaction.user.id;

        const bot = member ? member.bot : interaction.user.bot;
        if (bot) return interaction.editReply("You can't check a bot's money");

        const avatarURL = member
            ? member.displayAvatarURL({ format: "png", size: 512 })
            : interaction.user.displayAvatarURL({ format: "png", size: 512 });
        const userTag = member ? member.tag : interaction.user.tag;

        /// Try to create new database went this member not have!

        const user = await User.findOne({
            guildId: interaction.guild.id,
            userId: mention,
        });
        if (!user) {
            interaction.editReply("Something went wrong.");
        }
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: userTag, iconURL: avatarURL })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`Here are the stats for <@${mention}>`)
            .addFields({
                name: "Coin:",
                value: `\`$${numberWithCommas(user.balance)}\``,
                inline: true,
            })
            .addFields({
                name: "Bank:",
                value: `\`$${numberWithCommas(user.bank)}\``,
                inline: true,
            })
            .addFields({
                name: "Total:",
                value: `\`$${numberWithCommas(user.balance + user.bank)}\``,
                inline: true,
            })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    },
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
