const User = require("../models/User");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const config = require("../utils/default");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("crime")
        .setDescription("Crime to earn some money"),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });

        const user = await User.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        });

        const cooldown = new Date(user.crime_cooldown);
        const time = new Date(cooldown - new Date());
        const time_format = `${time.getUTCHours()} hours, ${time.getUTCMinutes()} minutes and ${time.getUTCSeconds()} seconds`;

        if (user.crime_cooldown > Date.now()) {
            return interaction.editReply(
                `You can't crime yet, you have to wait \`${time_format}\``,
            );
        }

        /// Random 1500 - 3000
        const amount =
            Math.floor(
                Math.random() *
                    (config.general.crime_money_min -
                        config.general.crime_money_max),
            ) + config.general.crime_money_max;
        /// + New Cooldown
        user.crime_cooldown = Date.now() + user.crime_cooldown_time * 1000;

        const chance = Math.floor(Math.random() * 100);
        if (chance > config.general.crime_chance) {
            if (user.crime_multiple == 0) {
                user.balance += amount;

                await user.save().then(async () => {
                    const embed = new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.avatarURL({
                                dynamic: true,
                            }),
                        })
                        .setDescription(
                            `${interaction.user} *has earned* \`$${numberWithCommas(amount)}\` *from crime*`,
                        )
                        .setThumbnail(
                            interaction.guild.iconURL({ dynamic: true }),
                        )
                        .setFooter({
                            text: `Cooldown: ${config.general.crime_cooldown_time} seconds`,
                        });

                    return interaction.editReply({ embeds: [embed] });
                });
            } else {
                const formatBoost = amount * user.crime_multiple;

                user.balance += formatBoost;

                await user.save().then(async () => {
                    const embed = new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.avatarURL({
                                dynamic: true,
                            }),
                        })
                        .setDescription(
                            `${interaction.user} *has earned* \`$${numberWithCommas(amount)}\` *from crime*`,
                        )
                        .setThumbnail(
                            interaction.guild.iconURL({ dynamic: true }),
                        )
                        .setFooter({
                            text: `Cooldown: ${user.crime_cooldown_time} seconds`,
                        });

                    return interaction.editReply({ embeds: [embed] });
                });
            }
        } else {
            if (user.crime_multiple == 0) {
                user.balance -= amount;

                await user.save().then(async () => {
                    const embed = new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.avatarURL({
                                dynamic: true,
                            }),
                        })
                        .setDescription(
                            `${interaction.user} *has been caught* *and lost* \`$${numberWithCommas(amount)}\` *from crime*`,
                        )
                        .setThumbnail(
                            interaction.guild.iconURL({ dynamic: true }),
                        )
                        .setFooter({
                            text: `Cooldown: ${user.crime_cooldown_time} seconds`,
                        });

                    return interaction.editReply({ embeds: [embed] });
                });
            } else {
                const formatBoost = amount * user.crime_multiple;

                user.balance -= formatBoost;

                await user.save().then(async () => {
                    const embed = new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.avatarURL({
                                dynamic: true,
                            }),
                        })
                        .setDescription(
                            `${interaction.user} *has been caught* *and lost* \`$${numberWithCommas(formatBoost)}\` *from crime*`,
                        )
                        .setThumbnail(
                            interaction.guild.iconURL({ dynamic: true }),
                        )
                        .setFooter({
                            text: `Cooldown: ${config.general.crime_cooldown_time} seconds`,
                        });

                    return interaction.editReply({ embeds: [embed] });
                });
            }
        }
    },
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
