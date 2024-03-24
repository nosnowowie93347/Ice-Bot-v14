const akinator = require("discord.js-akinator");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName("akinator")
        .setDescription("Akinator game"),
    async execute(interaction) {
        const language = "en"; //The language of the game. Defaults to "en".
        const childMode = false; //Whether to use Akinator's Child Mode. Defaults to "false".
        const gameType = "character"; //The type of Akinator game to be played. ("animal", "character" or "object"). Defaults to "character".
        const useButtons = true; //Whether to use Discord's buttons instead of message input for answering questions. Defaults to "true".
        const embedColor = "#1F1E33"; //The color of the message embeds. Defaults to "Random".
        const translationCachingOptions = {
            enabled: true, //Whether to cache translations. Defaults to "true". (Recommended)
            path: "./translationCache", //The path to the translation cache folder relative to the current working directory. Defaults to "./translationCache".
        };

        akinator(interaction, {
            language: language,
            childMode: childMode,
            gameType: gameType,
            useButtons: useButtons,
            embedColor: embedColor,
            translationCaching: translationCachingOptions,
        });
    },
};
