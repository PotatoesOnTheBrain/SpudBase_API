const mongoose = require("../connection.js");
const Message = require("./Message.js");
const User = require("./User.js");

const ConversationSchema = new mongoose.Schema({
    users: [User],
    messages: [Message],
    creation_date: {type: Date, default: Date.now()}
})

module.exports = mongoose.model("Conversation", ConversationSchema);