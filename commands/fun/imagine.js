const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { RsnChat } = require("rsnchat");
const fs = require("fs").promises;

module.exports = {
    cooldown: 30,
    data: new SlashCommandBuilder()
        .setName("imagine")
        .setDescription("Imagine an image with AI.")
        .addStringOption(option => option
            .setName("prompt")
            .setDescription('What image do you want to imagine.')
            .setRequired(true)
        )
        .addStringOption(x => x
            .setName("engine")
            .setDescription("Which AI Image Engine would you like to use.")
            .addChoices(
                { name: "Prodia", value: "prod" },
                { name: "Dall-e", value: "dalle" },
            )
        ),
    async execute(interaction, client) {
        const { options } = interaction;
        const configFileContent = await fs.readFile(
        `${process.cwd()}/config.json`,
        "utf8"
        );
        const config = JSON.parse(configFileContent);


        const rsnchat = new RsnChat(config.RSNCHAT_API);

        const engine = options.getString("engine") || "dalle";
        const prompt = options.getString("prompt");
        await interaction.reply({ content: `Generating "${prompt}" now` })

        const negative_prompt = "bad quality, blurry";

        switch (engine) {
            case "dalle":
                let image;
                rsnchat.dalle(prompt).then(async (response) => {
                    image = response.image.url;
                    await interaction.editReply({
                        embeds: [new EmbedBuilder().setImage(`${response.image.url}`).setColor('#ff0000')],
                        content: `Finished generating: ${prompt}`
                    });
                })
                break;
            case "prod":
                const model = "absolutereality_v181.safetensors [3d9d4d2b]";

                rsnchat.prodia(prompt, negative_prompt, model).then(async (response) => {
                    //console.log(response);
                    await interaction.editReply({
                        embeds: [new EmbedBuilder().setImage(`${response.imageUrl}`).setColor('#ff0000')],
                        content: `Finished generating: ${prompt}`
                    })
                });
                break;
        }
    }
}