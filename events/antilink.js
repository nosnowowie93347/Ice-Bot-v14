const fs = require("fs").promises;
const { EmbedBuilder } = require("discord.js");
 
module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (!message.guild) return;
    try {
      const configFileContent = await fs.readFile(
        `${process.cwd()}/antilinkConfig.json`,
        "utf8"
      );
      const config = JSON.parse(configFileContent);
 
      const blacklistedLinks = config.blacklistedLinks || [];
      const blacklistedTerms = config.blacklistedTerms || [];
      const whitelistedRoles = config.whitelistedRoles || [];
      
      if (message.author.bot) return;
 
      const content = message.content.toLowerCase();
 
      blacklistedLinks.forEach((link) => {
        if (content.includes(link)) {
          if (
            !whitelistedRoles.some((role) =>
              message.member.roles.cache.has(role)
            )
          ) {
            const blacklistedLinksEmbed = new EmbedBuilder()
              .setTitle("🔗 Links are not Allowed")
              .setDescription(
                `Hey ${message.author}, you cannot send links in ${message.guild.name}`
              )
              .setColor("#ff0000")
              .setFooter({ text: "Deleting in 5 Seconds" })
              .setTimestamp()
              .addFields({ name: "Deleted Message", value: message.content });
 
            message
              .reply({ embeds: [blacklistedLinksEmbed], ephemeral: true })
              .then((replyMessage) => {
                setTimeout(() => {
                  if (replyMessage.deletable) {
                    replyMessage.delete();
                  }
                }, 5000);
 
                if (message.deletable) {
                  message.delete();
                }
              })
              .catch((error) => {
                console.error("Error sending reply message:", error);
              });
 
            return;
          }
        }
      });
 
      blacklistedTerms.forEach(async (term) => {
        if (content.includes(term)) {
          if (
            !whitelistedRoles.some((role) =>
              message.member.roles.cache.has(role)
            )
          ) {

 
            const blacklistedTermEmbed = new EmbedBuilder()
              .setTitle("⚠️ Blacklisted Term Detected")
              .setDescription(
                `Hey ${message.author}, you cannot use the blacklisted term "${term}" in ${message.guild.name}.\n\n **You are now permanently banned from the server.**`
              )
              .setColor("#ff0000")
              .setFooter({ text: "Deleting in 5 Seconds" })
              .setTimestamp()
              .addFields({ name: "Deleted Message", value: message.content });
 
            message
              .reply({ embeds: [blacklistedTermEmbed], ephemeral: true })
              .then((replyMessage) => {
                setTimeout(() => {
                  if (replyMessage.deletable) {
                    replyMessage.delete();
                  }
                }, 5000);
                
                if (message.deletable) {
                  message.delete();
                }
              })
              .catch((error) => {
                console.error("Error sending reply message:", error);
              });
            try {
              await message.member.send('You have been kicked because you posted a blacklisted term.')
              await message.member.kick({
                reason: `Posting a blacklisted term: ${term}`,
              });
              
            } catch (error) {
              console.error("Error kicking member:", error);
              message.reply('cannot kick member')
            }
            return;
          }
        }
      });
    } catch (error) {
      console.error("Error reading config file:", error);
    }
  },
};