const { TicTacToe } = require("discord-gamecord");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("tictactoe")
		.setDescription("Starts a game of tic-tac-toe")
		.addUserOption((option) =>
      		option.setName("user").setRequired(true).setDescription("opponent")
      	),
	async execute(interaction) {
		const Game = new TicTacToe({
			message: interaction,
			isSlashGame: true,
			opponent: interaction.options.getUser('user'),
			embed: {
				title: "Tic Tac Toe",
				color: "#5865F2",
				statusTitle: "Status",
				overTitle: "Game Over",
			},
			emojis: {
				xButton: "❌",
				oButton: "🔵",
				blankButton: "➖",
			},
			mentionUser: true,
			timeoutTime: 95000,
			xButtonStyle: "DANGER",
			oButtonStyle: "PRIMARY",
			turnMessage: "{emoji} | Its turn of player **{player}**.",
			winMessage: "{emoji} | **{player}** won the TicTacToe Game.",
			tieMessage: "The Game tied! No one won the Game!",
			timeoutMessage: "The Game went unfinished! No one won the Game!",
			playerOnlyMessage:
				"Only {player} and {opponent} can use these buttons.",
		});

		Game.startGame();
		Game.on("gameOver", (result) => {
			console.log(result); // =>  { result... }
		});
	},
};
