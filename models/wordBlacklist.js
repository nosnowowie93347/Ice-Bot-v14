const { Schema, model } = require("mongoose");

let wordBlacklist = new Schema({
	guildid: String,
	words: Array,
});

module.exports = model("WordBlacklist", wordBlacklist);
