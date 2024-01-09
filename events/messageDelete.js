const { SlashCommandBuilder, escapeMarkdown, Collection, AuditLogEvent, EmbedBuilder } = require("discord.js")
const deletedAudits = new Collection();
module.exports = {
  name: 'messageDelete',
  async execute(message) {
  if(message.mentions.users.first()) {
        const embed = new EmbedBuilder()
        .setTitle("Ghost Ping")
        .setDescription(`${message.author.tag} ghost pinged ${message.mentions.users.first()}`)
        return message.channel.send({embeds: [embed] })
    }
  if (message.partial || !message.guild || !message.content) return;

  const audits = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete });
  const entries = audits.entries.first(5);
  const isNewEntry = Date.now() - entries[0].createdTimestamp < 500;
  let moderator = isNewEntry ? entries[0].executor : null;

  if (!moderator) {
    for (const entry of entries) {
      const oldCount = deletedAudits.get(entry.id);
      deletedAudits.set(entry.id, entry.extra.count);
      if (oldCount && oldCount < entry.extra.count) {
        moderator = entry.executor;
        break;
      }
    }
  }

  const embed = new EmbedBuilder()
    .setColor("#ffa500")
    .setTitle(`Message Deleted in #${message.channel.name} by ${message.author.displayAvatarURL()}`)
  const logChannel = message.guild.channels.cache.find(channel => channel.name === 'logs'); // Get this from somewhere
  if (logChannel) logChannel.send({ embeds: [embed] });
  }
}