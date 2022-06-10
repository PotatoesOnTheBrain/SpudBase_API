const mongoose = require("../connection.js");

const messageSchema = new mongoose.Schema({
    author: String,
    receivers: [String],
    subject: String,
    body: String
})

module.exports = mongoose.model("Message", messageSchema);