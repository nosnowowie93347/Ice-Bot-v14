const Discord = require('discord.js')

module.exports = async(interaction, client) => {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === "help_menu") {

        let msg = await interaction.channel.messages.fetch(interaction.message.id)

        if (interaction.values[0] === "fun") {

          await interaction.deferUpdate();

            const funEmbed = new Discord.EmbedBuilder()
        .setTitle("Fun Commands")
        .setDescription(
          "`country`, `daily`, `meme`, `ping`, `qr`, `year`"
        )
        .setColor("Random");

        await msg.edit({ embeds: [funEmbed] });

        } else if (interaction.values[0] === "image") {

          await interaction.deferUpdate();

            const imageEmbed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setTitle("Image Commands")
            .setDescription(
              "`4k`, `hug`, `kiss`, `poke`"
            )

            await msg.edit({ embeds: [imageEmbed]})

            } else if (interaction.values[0] === "info") {

          await interaction.deferUpdate();

            const infoEmbed = new Discord.EmbedBuilder()
        .setTitle("Info Commands")
        .setDescription(
          "`botinfo`, `country`, `help`, `imdb`, `level`, `npm`, `ping`, `playstore`, `suggest`, `todayinhistory`, `year`"
        )
        .setColor("Random");

        await msg.edit({ embeds: [infoEmbed] })

        } else if (interaction.values[0] === "moderation") {

          await interaction.deferUpdate();

            const modEmbed = new Discord.EmbedBuilder()
            .setTitle("Moderation Commands")
            .setDescription(
              "`kick`, `ban`, `mute`, `unmute`"
            )
            .setColor("Random");

            await msg.edit({ embeds: [modEmbed] })

        } else if (interaction.values[0] === "game") {

        await interaction.deferUpdate();

          const gameEmbed = new Discord.EmbedBuilder()
        .setTitle("Game Commands")
        .setDescription(
          "`akinator`, `hangman`, `rps`, `tictactoe`, `trivia`, `wordle`"
        )
        .setColor("Random");

        await msg.edit({ embeds: [gameEmbed] })
      } 
    }
}