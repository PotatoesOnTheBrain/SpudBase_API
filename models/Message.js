const mongoose = require("../connection.js");
const User = require("./User.js");

const messageSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    receivers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    body: String
})

module.exports = mongoose.model("Message", messageSchema);