const { SlashCommandBuilder } = require("discord.js");
const { Hangman } = require("discord-gamecord");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hangman")
        .setDescription("Starts a game of hangman"),
    async execute(interaction) {
        const Game = new Hangman({
            message: interaction,
            embed: {
                title: "Hangman",
                color: "#586582",
            },
            hangman: {
                hat: "🎩",
                head: "😟",
                shirt: "👕",
                pants: "🩳",
                boots: "👞",
            },
            timeout: 60000,
            timeWords: "all",
            winMessage: "You won! The word was **{word}**",
            loseMessage: "You lost! The word was **{word}**",
            playerOnlyMessage: "Only {player} can use these buttons.",
        });

        Game.startGame();
        Game.on("gameOver", (result) => {
            return;
        });
    },
};
