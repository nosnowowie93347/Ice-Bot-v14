const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to kick ')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the kick')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: "User not found in the guild.", ephemeral: true });
        }

        if (!member.bannable) {
            return interaction.reply({ content: "This user is not kickable.", ephemeral: true });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({ content: "You cannot kick yourself.", ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: "You cannot kick a user with an equal or higher role.", ephemeral: true });
        }

        try {
            await member.kick({ reason });

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('Kick Case')
                .setDescription(
                    `> User: ${user.tag}\n` +
                    `> Kicked by: ${interaction.user.tag}\n` +
                    `> Reason: ${reason}\n` +
                    `> Kicked on: ${new Date().toLocaleString()}\n` +
                    `> Expires: False`
                );

            const button = new ButtonBuilder()
                .setCustomId('view_case')
                .setLabel('View Case')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            const banMessage = await interaction.reply({
                content: `Successfully kicked \`${user.tag}\` with ID: \`${user.id}\``,
                components: [row],
                fetchReply: true
            });

            const filter = i => i.customId === 'view_case' && i.user.id === interaction.user.id;
            const collector = banMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (!i.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                    await i.reply({ content: "You don't have permission to view this case.", ephemeral: true });
                    return;
                }

                if (i.customId === 'view_case') {
                    await i.reply({ embeds: [embed], ephemeral: true });
                }
            });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to kick this user.', ephemeral: true });
        }
    }
};