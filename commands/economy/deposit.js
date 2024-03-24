const User = require("../../models/User");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 15,
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDMPermission(false)
        .setDescription("Deposit money into your bank")
        .addStringOption((option) =>
            option
                .setName("amount")
                .setRequired(true)
                .setDescription("Amount of money to deposit"),
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
        /// NEED AMOUNT AND ALL

        const user = await User.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        });

        if (args > user.balance) {
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(
                    `You don't have enough money to deposit this amount.`,
                )
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args.toLowerCase() == "all") {
            /// DEPOSIT ALL
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(
                    `You have deposited \`$${numberWithCommas(user.balance)}\` into your bank.`,
                )
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            user.bank += user.balance;
            user.balance = 0;

            await user.save();
        } else {
            /// DEPOSIT AMOUNT
            user.bank += parseInt(args);
            user.balance -= parseInt(args);

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(
                    `You have deposited \`$${numberWithCommas(args)}\` into your bank.`,
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
