const User = require("../models/User");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Pay someone")
        .addStringOption((option) =>
            option
                .setName("amount")
                .setRequired(true)
                .setDescription("the amount you want to pay"),
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setRequired(true)
                .setDescription("user to pay"),
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

        const member = interaction.options.getUser("user");
        if (member.id === interaction.user.id)
            return interaction.editReply("You can't pay yourself.");
        if (member.bot) return interaction.editReply("You can't pay bots.");

        /// Try to create new database went this member not have!

        const user = await User.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        });
        console.log(user);
        let target = await User.findOne({
            guildId: interaction.guild.id,
            userId: member.id,
        });
        if (!target) {
            target = new User({
                userId: member.id,
                guildId: interaction.guild.id,
            });
        }
        if (args > user.balance) {
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(
                    `You don't have enough money to pay this amount.`,
                )
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (user.balance < -1) {
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(`You have are negative money!`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args.toLowerCase() == "all") {
            /// PAY ALL
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(
                    `You pay \`$${numberWithCommas(user.balance)}\` to ${member}.`,
                )
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            target.balance += user.balance;
            user.balance = 0;

            await target.save();
            await user.save();
        } else {
            /// PAY AMOUNT
            target.balance += parseInt(args);
            user.balance -= parseInt(args);

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(
                    `You pay \`$${numberWithCommas(args)}\` to ${member}.`,
                )
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            await target.save();
            await user.save();
        }
    },
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
