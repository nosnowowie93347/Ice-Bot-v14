const User = require("../models/User");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const config = require("../utils/default");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rob")
        .setDescription("Rob someone of some money.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setRequired(true)
                .setDescription("user to rob"),
        ),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });

        const member = interaction.options.getUser("user");
        if (member.id === interaction.user.id)
            return interaction.editReply("You can't rob yourself.");
        if (member.bot) return interaction.editReply("You can't rob bots.");

        /// Try to create new database went this member not have!

        const user = await User.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        });

        if (user && user.rob) {
            const cooldown = new Date(user.rob_cooldown);
            const time = new Date(cooldown - new Date());
            const time_format = `${time.getUTCHours()} hours, ${time.getUTCMinutes()} minutes and ${time.getUTCSeconds()} seconds`;

            if (user.rob_cooldown > Date.now()) {
                return interaction.editReply(
                    `You can't rob yet, you have to wait \`${time_format}\``,
                );
            }

            const target = await User.findOne({
                guildId: interaction.guild.id,
                userId: member.id,
            });
            if (!target) {
                const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.avatarURL({ dynamic: true }),
                    })
                    .setDescription(`${member} *does not have money*`)
                    .setTimestamp();

                interaction.editReply({ embeds: [embed] });
                return;
            }

            const chance = Math.floor(Math.random() * 100);
            if (chance > config.general.rob_chance) {
                const lostmoney = Math.floor(target.balance / 2);

                const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.avatarURL({ dynamic: true }),
                    })
                    .setDescription(
                        `You successfully robbed ${member} of ${numberWithCommas(lostmoney)} coins!`,
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [embed] });

                user.balance += lostmoney;
                user.rob_cooldown = Date.now() + user.rob_cooldown_time * 1000;
                await user.save();

                target.balance -= lostmoney;
                await target.save();
            } else {
                const lostmoney = Math.floor(user.balance / 2);

                const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.avatarURL({ dynamic: true }),
                    })
                    .setDescription(
                        `You failed to rob ${member}! They got away with ${numberWithCommas(lostmoney)} coins!`,
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [embed] });

                user.balance -= lostmoney;
                user.rob_cooldown = Date.now() + user.rob_cooldown_time * 1000;
                await user.save();
            }
        } else {
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(`You don't have the permission to rob.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });
            return;
        }
    },
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
