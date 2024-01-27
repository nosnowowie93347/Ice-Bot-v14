const { Client, Message, EmbedBuilder, ChannelType } = require("discord.js");
const calculateLevelXp = require("../utils/calculateLevelXP");
const Level = require("../models/Level");
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Message} message
 */
module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (
      message.author.bot ||
      message.channel.type == ChannelType.DM ||
      cooldowns.has(message.author.id)
    )
      return;

    const xpToGive = getRandomXp(50, 70);
    console.log(xpToGive);
    const query = {
      userId: message.author.id,
      guildId: message.guild.id,
    };

    try {
      const level = await Level.findOne(query);

      if (level) {
        level.xp += xpToGive;

        if (level.xp > calculateLevelXp(level.level)) {
          level.xp = 0;
          level.level += 1;
          message.channel.send(
            `${message.member} you have leveled up to **level ${level.level}**.`,
          );
        }

        await level.save().catch((e) => {
          console.log(`Error saving updated level ${e}`);
          return;
        });
        cooldowns.add(message.author.id);
        setTimeout(() => {
          cooldowns.delete(message.author.id);
        }, 30000);
      }

      // if (!level)
      else {
        // create new level
        const newLevel = new Level({
          userId: message.author.id,
          guildId: message.guild.id,
          xp: xpToGive,
        });

        await newLevel.save();
        cooldowns.add(message.author.id);
        setTimeout(() => {
          cooldowns.delete(message.author.id);
        }, 30000);
        console.log("I think this works now!");
      }
    } catch (error) {
      console.log(`Error giving xp: ${error}`);
    }
  },
};
