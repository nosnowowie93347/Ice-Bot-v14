const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("emojilist")
    .setDMPermission(false)
    .setDescription("List emojis in this guild"),
  async execute(interaction) {
    async function chunkArray(array, size) {
      let chunks = [];
      for (let i = 0; i < array.length; i += size) {
        const chunk = array.slice(i, i + size);
        chunks.push(chunk);
      }

      return chunks;
    }

    async function send(chunked) {
      var intResponse;
      await chunked.forEach(async (emoji) => {
        if (intResponse == 1) {
          embed.setDescription(emoji.join(" ")).setTitle(" ");
          await interaction.channel.send({ embeds: [embed] });
        } else {
          intResponse = 1;
          var total = interaction.guild.emojis.cache.size;
          var animated = interaction.guild.emojis.cache.filter(
            (emoji) => emoji.animated,
          ).size;
          embed
            .setTitle(
              `${total - animated} Regular, ${animated} Animated, ${total} Total`,
            )
            .setDescription(emoji.join(" "));

          await interaction.reply({ embeds: [embed] });
        }
      });
    }

    var emojis = [];
    var cache = interaction.guild.emojis.fetch();

    await interaction.guild.emojis.cache.forEach(async (emoji) => {
      if (emoji.animated) {
        emojis.push(`<a:${emoji.name}:${emoji.id}>`);
      } else {
        emojis.push(`<:${emoji.name}:${emoji.id}>`);
      }
    });

    var chunked = await chunkArray(emojis, 50);
    const embed = new EmbedBuilder().setColor("Blurple");
    var redo;
    await chunked.forEach(async (chunk) => {
      if (chunk.join(" ").length > 2000) redo = true;
      else redo = false;
    });

    if (redo) {
      var newChunk = await chunkArray(emojis, 20);
      send(newChunk);
    } else {
      send(chunked);
    }
  },
};
