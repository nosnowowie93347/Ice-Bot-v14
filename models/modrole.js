const { model, Schema } = require("mongoose");

let modrole = new Schema({
	Guild: String,
	Role: String,
});

module.exports = model("Modrole", modrole);
