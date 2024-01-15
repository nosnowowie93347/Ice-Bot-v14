const Canvas = require("canvas");
const { AttachmentBuilder, Discord } = require("discord.js");
module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const applyText = (canvas, text) => {
      const ctx = canvas.getContext("2d");

      // Declare a base size of the font
      let fontSize = 70;

      do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `${(fontSize -= 10)}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
      } while (ctx.measureText(text).width > canvas.width - 300);

      // Return the result to use in the actual canvas
      return ctx.font;
    };

    const channel = await member.guild.channels.cache.find(
      (channel) => channel.name === "welcome"
    );
    if (!channel) return;

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("./wallpaper.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#74037b";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    ctx.font = "28px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      "Welcome to the server,",
      canvas.width / 2.5,
      canvas.height / 3.5
    );

    // Add an exclamation point here and below
    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      `${member.displayName}!`,
      canvas.width / 2.5,
      canvas.height / 1.8
    );

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(
      member.user.avatarURL({ extension: "png" })
    );
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "welcome-image.png",
    });

    channel.send({
      content: `Welcome to the server, ${member}!`,
      files: [attachment],
    });
  },
};
