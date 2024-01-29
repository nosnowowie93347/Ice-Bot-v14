const { Schema, model } = require("mongoose");

const warnSchema = new Schema({
  guildId: String,
  userId: String,
  warnReason: String,
  warnDate: String,
  moderator: String,
});

module.exports = model("warningSchema", warnSchema, "userWarns");