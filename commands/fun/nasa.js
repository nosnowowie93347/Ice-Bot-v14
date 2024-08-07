const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName(`nasa`)
	.setDescription(`Gets the image of the day from nasa`),
	async execute (interaction) {
		try {
			let NASA_API_KEY = "DIQeN4SYQ0TCIeUDt9Z7qeR0gbpEQvbLPjdumyEK";
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const nasaEmbed = new EmbedBuilder()
                .setColor('#1A98E0')
                .setTitle('NASA Astronomy Picture of the Day')
                .setImage(data.url)
                .setDescription(data.explanation)
                .setTimestamp()
                .setFooter({ text: 'Ice Bot', iconURL: interaction.client.user.displayAvatarURL() });

            interaction.reply({ embeds: [nasaEmbed] });

        } catch (error) {
            console.error('Failed to fetch NASA APOD:', error);
            interaction.reply('Failed to fetch NASA Astronomy Picture of the Day. Please try again later.');
        }
	}
}