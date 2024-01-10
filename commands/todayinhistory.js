const request = require('node-superfetch');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName("today-in-history")
	.setDescription("today in history")
	.addStringOption((option) =>
      option
        .setName("month")
        .setRequired(true)
        .setDescription("id of user to unban"),
    )
    .addStringOption((option) =>
      option
        .setName("day")
        .setRequired(true)
        .setDescription("id of user to unban"),
    ),
    	async execute(interaction) {
        const month = interaction.options.getString('month');
        const day = interaction.options.getString("day");

        if(isNaN(month)) {
            return interaction.reply('please enter a valid month');
        }

        if(isNaN(day)) {
            return interaction.reply('please enter a valid date');
        }

        const date = month && day ? `/${month}/${day}` : '';
		try {
			const { text } = await request.get(`http://history.muffinlabs.com/date${date}`);
			const body = JSON.parse(text);
			const events = body.data.Events;
			const event = events[Math.floor(Math.random() * events.length)];
			const embed = new EmbedBuilder()
				.setColor("#9797FF")
				.setURL(body.url)
				.setTitle(`On this day (${body.date})...`)
				.setTimestamp()
				.setDescription(`${event.year}: ${event.text}`)
				.addFields({ name: '❯ See More',
					value: event.links.map(link => `[${link.title}](${link.link.replace(/\)/g, '%29')})`).join(', ') });
            
            return interaction.reply({ embeds: [embed] });
        } 
        catch (err) {
			if (err.status === 404 || err.status === 500) return interaction.reply('Invalid date.');
			return interaction.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
    }
}