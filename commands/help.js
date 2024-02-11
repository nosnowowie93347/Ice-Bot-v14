const {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder().setName("help").setDescription("Get help"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Commands`, iconURL: interaction.guild.iconURL() })
      .setColor("Blue")
      .setTitle("Help Center")
      .setTimestamp()
      .setDescription("Help Command Guide:")
      .addFields({ name: "Page 1", value: "Help & Resources (button1)" })
      .addFields({ name: "Page 2", value: "Fun Commands (button2)" })
      .addFields({ name: "Page 3", value: "Moderation Commands (button3)" })
      .addFields({ name: "Page 4", value: "Economy Commands (button4)" });

    const embed2 = new EmbedBuilder()
      .setAuthor({ name: `Commands`, iconURL: interaction.guild.iconURL() })
      .setColor("Blue")
      .setTitle("Fun Commands")
      .setTimestamp()

      .addFields({
        name: "/lookingforgroup",
        value: "look for gaming group",
        inline: true,
      })
      .addFields({ name: "/roleinfo", value: "Info on a role", inline: true })
      .addFields({ name: "/userinfo", value: "Info on a user", inline: true })
      .addFields({
        name: "/emojimixer",
        value: "Combine two emojis",
        inline: true,
      })
      .addFields({
        name: "/botinfo",
        value: "Info about the bot",
        inline: true,
      })
      .addFields({
        name: "/akinator",
        value: "Play a game of akinator",
        inline: true,
      })
      .addFields({
        name: "/country",
        value: "Get info on a country",
        inline: true,
      })
      .addFields({
        name: "/discordjs-docs",
        value: "Search the Discord.js docs",
        inline: true,
      })
      .addFields({
        name: "/guessthepokemon",
        value: "Who's that Pokemon?",
        inline: true,
      })
      .addFields({
        name: "/hangman",
        value: "Play a game of hangman",
        inline: true,
      })
      .addFields({ name: "/hug", value: "Hug someone!", inline: true })
      .addFields({
        name: "/imdb",
        value: "Get info on a movie/tv show",
        inline: true,
      })
      .addFields({ name: "/kiss", value: "Kiss someone!", inline: true })
      .addFields({
        name: "/meme",
        value: "Get a hilarious dank meme",
        inline: true,
      })
      .addFields({
        name: "/npm",
        value: "Get info on an NPM package",
        inline: true,
      })
      .addFields({
        name: "/playstore",
        value: "Search the playstore for an app",
      })
      .addFields({ name: "/poke", value: "Poke someone!" })
      .addFields({ name: "/qr", value: "Turn text or a link into a qr code" })
      .addFields({ name: "/randomimage", value: "Get a random image" })
      .addFields({ name: "/rps", value: "Play a game of rock paper scissors" })
      .addFields({
        name: "/tictactoe",
        value: "Play tic tac toe against another user",
      })
      .addFields({
        name: "/todayinhistory",
        value: "Displays an interesting historical event on a specific day",
      })
      .addFields({ name: "/trivia", value: "Test your knowledge!" })
      .addFields({ name: "/wordle", value: "Play a game of Wordle" })
      .addFields({ name: "/year", value: "How much longer until next year?" });

    const embed3 = new EmbedBuilder()
      .setAuthor({ name: `Commands`, iconURL: interaction.guild.iconURL() })
      .setColor("Blue")
      .setTitle("Moderation Commands")
      .setTimestamp()
      .addFields({ name: "/ban", value: "Ban anyone with one shot xD" })
      .addFields({ name: "/dm", value: "Sends a dm to anyone" })
      .addFields({
        name: "/modrole",
        value: "setup mod roles in the guild. Must have admin perms",
      })
      .addFields({
        name: "/counting",
        value: "setup counting system. Must have admin perms",
      })
      .addFields({ name: "/kick", value: "Kick anyone with one shot xD" })
      .addFields({ name: "/mute", value: "Mute anyone with one shot xD" })
      .addFields({
        name: "/reactionroles",
        value: "Manage reaction roles system",
      })
      .addFields({ name: "/unban", value: "Unban anyone with one shot xD" })
      .addFields({ name: "/unmute", value: "Unmute anyone with one shot xD" })
      .addFields({
        name: "/welcome-system",
        value: "Setup the Welcome System for this server",
      });

    const embed4 = new EmbedBuilder()
      .setAuthor({ name: `Commands`, iconURL: interaction.guild.iconURL() })
      .setColor("Blue")
      .setTitle("Economy and Other Commands")
      .setTimestamp()
      .addFields({
        name: "/help",
        value: "Do /help for the commands list",
        inline: true,
      })
      .addFields({
        name: "/leaderboard",
        value: "View the leaderboard for the leveling system",
        inline: true,
      })
      .addFields({
        name: "/balance",
        value: "Get your balance or another users balance",
        inline: true,
      })
      .addFields({
        name: "/crime",
        value: "Crime to (maybe) earn some money",
        inline: true,
      })
      .addFields({ name: "/daily", value: "Collect daily money", inline: true })
      .addFields({
        name: "/deposit",
        value: "Deposite some of your money into your bank",
        inline: true,
      })
      .addFields({
        name: "/pay",
        value: "Pay someone some money",
        inline: true,
      })
      .addFields({
        name: "/rob",
        value: "Rob someone of their precious money!",
        inline: true,
      })
      .addFields({
        name: "/shop",
        value: "WORK IN PROGRESS, buy some things with your money",
        inline: true,
      })
      .addFields({
        name: "/withdraw",
        value: "Withdraw money from your bank",
        inline: true,
      })
      .addFields({
        name: "/work",
        value: "Work to earn some money",
        inline: true,
      });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("page1")
        .setLabel("Page 1")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("page2")
        .setLabel("Page 2")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("page3")
        .setLabel("Page 3")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("page4")
        .setLabel("Page 4")
        .setStyle(ButtonStyle.Success)
    );

    const message = await interaction.reply({
      embeds: [embed],
      components: [button],
    });
    const collector = await message.createMessageComponentCollector();
    collector.on("collect", async (i) => {
      if (i.customId === "page1") {
        if (i.user.id !== interaction.user.id) {
          return await interaction.reply(
            `Only ${interaction.user.id} can use this command`
          );
        }
        await i.update({ embeds: [embed], components: [button] });
      }

      if (i.customId === "page2") {
        if (i.user.id !== interaction.user.id) {
          return await interaction.reply(
            `Only ${interaction.user.id} can use this command`
          );
        }
        await i.update({ embeds: [embed2], components: [button] });
      }

      if (i.customId === "page3") {
        if (i.user.id !== interaction.user.id) {
          return await interaction.reply(
            `Only ${interaction.user.id} can use this command`
          );
        }
        await i.update({ embeds: [embed3], components: [button] });
      }

      if (i.customId === "page4") {
        if (i.user.id !== interaction.user.id) {
          return await interaction.reply(
            `Only ${interaction.user.id} can use this command`
          );
        }
        await i.update({ embeds: [embed4], components: [button] });
      }
    });
  },
};
