const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("banlist").setDescription("hello"),
    async execute(interaction) {
        interaction.guild.bans
            .fetch()
            .then(async (banned) => {
                let list = banned.map(
                    (banUser) =>
                        `${banUser.user.tag} ・**Reason:** ${banUser.reason || "No reason"} `,
                );

                await interaction.reply(
                    `🔧・Banlist - ${interaction.guild.name} ` + list,
                );
            })
            .catch((error) => {
                console.log(error);
            });
    },
};
