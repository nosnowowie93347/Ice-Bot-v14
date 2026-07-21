const { Message, ChannelType } = require("discord.js");
const calculateLevelXp = require("../utils/calculateLevelXP");
const Level = require("../models/Level");

// Using a Map lets you easily clear timers if needed, though Set works fine too.
const cooldowns = new Set();

function getRandomXp(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Message} message
 */
module.exports = {
  name: "messageCreate",
  async execute(message) {
    // 1. Fast Guard Clauses: Filter out bots, DMs, missing guilds, or users on cooldown immediately.
    if (
      !message.guild ||
      message.author.bot ||
      message.channel.type === ChannelType.DM ||
      cooldowns.has(message.author.id)
    ) {
      return;
    }

    // 2. Cooldown handling
    cooldowns.add(message.author.id);
    setTimeout(() => cooldowns.delete(message.author.id), 40000);

    const xpToGive = getRandomXp(50, 70);
    const query = {
      userId: message.author.id,
      guildId: message.guild.id,
    };

    try {
      // 3. Atomic Upsert: Finds and increments XP in ONE database operation.
      // If the document doesn't exist, 'upsert: true' creates it automatically.
      const level = await Level.findOneAndUpdate(
        query,
        { $inc: { xp: xpToGive } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // 4. Level Up Logic
      let neededXp = calculateLevelXp(level.level);
      
      if (level.xp >= neededXp) {
        let leveledUp = false;

        while (level.xp >= neededXp) {
          level.xp -= neededXp;
          level.level += 1;
          neededXp = calculateLevelXp(level.level); // Recalculate for next level step
          leveledUp = true;
        }

        if (leveledUp) {
          // Save the level advancement back to the DB
          await level.save();

          await message.channel
            .send(`${message.author}, you have leveled up to **level ${level.level}**!`)
            .catch((e) => console.error(`Failed to send level up message: ${e.message}`));
        }
      }
    } catch (error) {
      console.error(`Error giving XP to ${message.author.id}:`, error);
    }
  },
};