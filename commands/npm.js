const npmsearch = require("libnpmsearch");
const {
    Client,
    Message,
    EmbedBuilder,
    SlashCommandBuilder,
} = require("discord.js");
const moment = require("moment-timezone");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("npm")
        .setDescription("Searches npm")
        .addStringOption((option) =>
            option
                .setName("packagename")
                .setRequired(true)
                .setDescription("id of user to unban"),
        ),
    async execute(interaction) {
        let toSearch = interaction.options.getString("packagename");
        npmsearch(toSearch, {
            limit: 1,
        }).then(async (result) => {
            if (!result.length) {
                return interaction.reply(
                    "Sorry I can't find any node package you want",
                );
            }
            let res = result[0];
            let keywords = Object.keys(res).includes("keywords")
                ? res["keywords"].map((keyword) => `\`${keyword}\``)
                : ["No Data"];
            let maintainers = res["maintainers"].map(
                (maintainer) => `\`${maintainer["username"]}\``,
            );
            let links = Object.keys(res["links"]).map(
                (key) => `**${key}：**${res["links"][key]}`,
            );
            let publishDate = moment(res["date"]).tz("America/Los_Angeles");
            const embed = new EmbedBuilder()
                .setColor("#C80B06")
                .setTitle(res["name"])
                .setDescription(res["description"])
                .setThumbnail("https://i.imgur.com/ErKf5Y0.png")
                .addFields(
                    { name: "Version", value: `\`${res["version"]}\`` },
                    {
                        name: "Published Date: ",
                        value: `${publishDate.format(
                            "YYYY-MM-DD HH:mm",
                        )} \`${publishDate.fromNow()}\``,
                    },
                    { name: "Keywords: ", value: keywords.join(", ") },
                    { name: "Links: ", value: links.join("\n") },
                );
            await interaction.reply({
                embeds: [embed],
            });
        });
    },
};
