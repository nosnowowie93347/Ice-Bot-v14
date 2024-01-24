const User = require("../models/User");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Withdraw money from your bank")
        .addStringOption((option) =>
            option
                .setName("amount")
                .setRequired(true)
                .setDescription("The amount you want to withdraw."),
        ),

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });
        const args = interaction.options.getString("amount");

        const filters = ["+", "-"];

        for (const message in filters) {
            if (args.includes(filters[message]))
                return interaction.editReply("You can't do that!");
        }

        if (args != parseInt(args) && args != "all")
            return interaction.editReply(
                "Please provide a valid amount or all",
            );

        const user = await User.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        });

        if (args > user.bank) {
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(
                    `You don't have enough money to withdraw this amount.`,
                )
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args.toLowerCase() == "all") {
            /// WITHDRAW ALL
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(
                    `You have withdraw \`$${numberWithCommas(user.bank)}\` from your bank.`,
                )
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            user.balance += user.bank;
            user.bank = 0;

            await user.save();
        } else {
            /// DEPOSIT AMOUNT
            user.balance += parseInt(args);
            user.bank -= parseInt(args);

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(
                    `You have withdraw \`$${numberWithCommas(args)}\` from your bank.`,
                )
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            await user.save();
        }
    },
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
