const { Schema, model } = require("mongoose");
const modLogsSchema = new Schema({
  guildId: String,
  channelId: String,
});

module.exports = model("modSchema", modLogsSchema, "serverModlogs");
