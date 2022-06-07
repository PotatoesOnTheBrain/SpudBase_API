const mongoose = require("../connection.js");

const messageSchema = new mongoose.Schema({
    author: String,
    receivers: [String],
    subject: String,
    body: String,
    isPrivate: Boolean
})

module.exports = mongoose.model("Message", messageSchema);