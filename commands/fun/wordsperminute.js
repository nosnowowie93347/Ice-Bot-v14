const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, AttachmentBuilder } = require('discord.js')
const { createCanvas, loadImage } = require('canvas')
module.exports = {
	cooldown: 10,
    data: new SlashCommandBuilder()
    .setName("typing-speedtest")
    .setDescription("See how fast you type with a speed test!")
    .addIntegerOption(option => option.setName("words").setDescription("How many words should be in the test?").setMinValue(20).setMaxValue(50).setRequired(true)),
    async execute (interaction) {
    	const wordCount = interaction.options.getInteger('words')

    	const words = ["apple", "banana", "cherry", "grape", "orange", "lemon", "peach", "melon", "berry", "mango",
            "table", "chair", "desk", "couch", "shelf", "lamp", "door", "window", "floor", "ceiling",
            "happy", "smile", "laugh", "funny", "silly", "crazy", "kind", "nice", "brave", "smart",
            "quick", "slow", "fast", "strong", "light", "dark", "soft", "hard", "loud", "quiet",
            "run", "walk", "jump", "climb", "swim", "fly", "drive", "ride", "skip", "crawl",
            "cat", "dog", "fish", "bird", "mouse", "horse", "rabbit", "turtle", "sheep", "cow",
            "red", "blue", "green", "yellow", "pink", "purple", "black", "white", "brown", "gray",
            "sun", "moon", "star", "cloud", "rain", "snow", "storm", "wind", "sky", "ocean",
            "home", "house", "school", "park", "store", "market", "library", "garden", "yard", "road",
            "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

        await interaction.reply({ content: `🔴 Your typing test is starting...` })

        var outputWords = ""
        var outputWordArray = []
        var control = 1;
        for (i = 0; i<wordCount; i++) {
        	const randomNum = Math.floor(Math.random() * words.length);

        	if(i%5==0 && i>0) {
        		outputWords += "\n";
        		control++;
        	}
        	outputWords += words[randomNum]+" ";
        	outputWordArray[i] = words[randomNum];
        }

        const canvas = createCanvas(5000, 500*control);
        const ctx = canvas.getContext("2d");
        ctx.font = '300px Arial';
        ctx.fillStyle = "pink";
        ctx.fillText(outputWords, 0, canvas.height/control);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image.png' });

        await new Promise(resolve => setTimeout(resolve, 2000));
        await interaction.channel.send("Starting in:");
        for (i=3; i!=0; i--) {
        	await interaction.channel.send("" + i);
        	await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await interaction.channel.send("GO!");

        await interaction.channel.send({ content: "", files: [attachment]});
        await interaction.editReply({ content: `🟢 Your typing test has started! Type the words in order from the message below...` });

        const start = Date.now();
        const collector = interaction.channel.createMessageCollector({ time: 120000 });
        const buttonCollector = interaction.channel.createMessageComponentCollector({ time: 120000 });

        var complete = false;
        var elapsed = 0;
        var correctWords = 0;
        var msg;
        var wpm = 0;

        collector.on('collect', async m => {
        	if (m.author.id === interaction.user.id) {
        		const end = Date.now();
        		elapsed = (end - start) / 1000;

        		for (i=0; i<wordCount; i++) {
        			if (m.content.includes(outputWordArray[i])) {
        				correctWords++;
        			}
        		}

        		if (correctWords < wordCount/2) {
        			await interaction.channel.send(`🔴 Try again, this time be sure to be more accurate!`);
        			await interaction.editReply(`🔴 Your typing test is complete.`);
        		} else {
        			const button = new ActionRowBuilder()
        			.addComponents(
        				new ButtonBuilder()
        				.setCustomId('speedTestInfo')
        				.setLabel('Get Stats')
        				.setStyle(ButtonStyle.Primary)
        			);

        			wpm = Math.floor(correctWords / (elapsed/60));
        			msg = await interaction.channel.send({ content: `🟢 Your **WPM** is: \`${wpm}\``, components: [button]});
        			await interaction.editReply({ content: `🔴 Your typing test is complete.` });
        			collector.stop();
        			complete = true;
        		}
        	}
        });

        buttonCollector.on('collect', async i => {
        	const accuracyPercent = (correctWords/wordCount) * 100;
        	if (i.customId == "speedTestInfo") {
        		await i.reply({ content: `⏲️ Test Time: \`${elapsed}\` (seconds)\n💪 Accuracy: \`${correctWords}/${wordCount}\` OR **${accuracyPercent}%**`}).catch(err => {});
        	}
        });

        buttonCollector.on('end', async i => {
        	if (!msg) return;
        	msg.edit(`✅ Your **WPM** is: \`${wpm}\``).catch(err => {});
        });

        setTimeout(async () => {
        	if (!complete) {
        		await interaction.editReply(`🔴 Your typing test is invalid.`);
        	}
        });

    }
}