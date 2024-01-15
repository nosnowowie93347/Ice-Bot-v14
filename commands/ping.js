const { SlashCommandBuilder } = require("discord.js");

module.exports = {
<<<<<<< HEAD
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(`Replies with "Pong!"`),
=======
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription(`Replies with "Pong!"`),
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094

  async execute(interaction) {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

<<<<<<< HEAD
    interaction.editReply(
      `Pong! Client ${ping}ms | Websocket: ${interaction.client.ws.ping}ms`
    );
  },
=======
		interaction.editReply(
			`Pong! Client ${ping}ms | Websocket: ${interaction.client.ws.ping}ms`,
		);
	},
>>>>>>> f84f62cfc7e999d2b7f74a685407d977d08b9094
};
