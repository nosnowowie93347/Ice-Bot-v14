const User = require("../models/User");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const config = require("../utils/default");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work to earn money"),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });

        const user = await User.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        });

        const cooldown = new Date(user.work_cooldown);
        const time = new Date(cooldown - new Date());
        const time_format = `${time.getUTCHours()} hours, ${time.getUTCMinutes()} minutes and ${time.getUTCSeconds()} seconds`;

        if (user.work_cooldown > Date.now()) {
            return interaction.editReply(
                `You can't work yet, you have to wait \`${time_format}\``,
            );
        }

        const amount =
            Math.floor(
                Math.random() *
                    (config.general.work_money_min -
                        config.general.work_money_max),
            ) + config.general.work_money_max;

        user.work_cooldown = Date.now() + user.work_cooldown_time * 1000;

        /// Work Multiple Boost
        if (user.work_multiple == 0) {
            // Get default amount
            user.balance += amount;
            /// Save database
            await user.save().then(async () => {
                const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.avatarURL({ dynamic: true }),
                    })
                    .setDescription(
                        `${interaction.user} *has earned* \`$${numberWithCommas(amount)}\` *from work*`,
                    )
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setFooter({
                        text: `Cooldown: ${user.work_cooldown_time} seconds`,
                    });

                return interaction.editReply({ embeds: [embed] });
            });
        } else {
            const formatBoost = amount * user.work_multiple;
            console.log(user.work_multiple);
            // Get boost amount
            user.balance += formatBoost;
            /// Save database
            await user.save().then(async () => {
                const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.avatarURL({ dynamic: true }),
                    })
                    .setDescription(
                        `${interaction.user} *has earned* \`$${numberWithCommas(formatBoost)}\` *from work*`,
                    )
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setFooter({
                        text: `Cooldown: ${user.work_cooldown_time} seconds`,
                    });

                return interaction.editReply({ embeds: [embed] });
            });
        }
    },
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
