const { version, SlashCommandBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const Discord = require("discord.js");
let os = require("os");
let cpuStat = require("cpu-stat");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

module.exports = {
  data: new SlashCommandBuilder().setName("stats").setDescription("no"),
  async execute(interaction) {
    // eslint-disable-line no-unused-vars
    try {
      const cmdFiles = await readdir("./Commands/");
      let cpuLol;
      cpuStat.usagePercent(function (err, percent, seconds) {
        if (err) {
          return console.log(err);
        }
        const duration = moment
          .duration(interaction.client.uptime)
          .format(" D [days], H [hrs], m [mins], s [secs]");
        const RynEmb = new Discord.EmbedBuilder()

          .setDescription("Bot's Stats:")
          .setTimestamp()
          .setColor("Random")

          .addFields([
            {
              name: ":floppy_disk: Memory usage",
              value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(
                os.totalmem() /
                1024 /
                1024
              ).toFixed(2)} MB`,
            },
            {
              name: ":minidisc: CPU usage",
              value: `\`${percent.toFixed(2)}%\``,
            },
            {
              name: "CPU",
              value: `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``,
            },
            { name: ":computer: System", value: `\`${os.arch()}\`` },
            { name: ":desktop: Platform", value: `\`\`${os.platform()}\`\`` },
            {
              name: "👥 Users",
              value: `${interaction.client.users.cache.size}`,
            },
            {
              name: "Servers",
              value: `${interaction.client.guilds.cache.size}`,
            },
            {
              name: "Channels",
              value: `${interaction.client.channels.cache.size}`,
            },
            {
              name: "Commands Count",
              value: `${interaction.client.commands.size}`,
            },
            { name: "Library", value: `\`Discord.js\`` },
            { name: "Library Version", value: `v${version}` },
            { name: ":book: Node Version", value: `${process.version}` },
            {
              name: ":stopwatch: Uptime & Ping",
              value: `${duration} / ${Math.round(interaction.client.ws.ping)}ms`,
            },
          ]);
        interaction.reply({ embeds: [RynEmb] });
      });
    } catch (err) {
      const errorlogs = interaction.client.channels.cache.get(
        "1204916009417449542",
      );
      interaction.reply(
        `Whoops, We got a error right now! This error has been reported to Support center!`,
      );
      errorlogs.send(`Error on stats commands!\n\nError:\n\n ${err}`);
    }
  },
};
