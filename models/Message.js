const mongoose = require("../connection.js");
const User = require("./User.js");
const Conversation = require("./Conversation.js");

const MessageSchema = new mongoose.Schema({
    author: User,
    body: String,
    conversation: Conversation,
    creation_date: {type: Date, default: Date.now()}
})

module.exports = mongoose.model("Message", MessageSchema);