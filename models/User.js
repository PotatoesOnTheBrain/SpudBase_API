const mongoose = require("../connection.js")
const Conversation = require("./Conversation.js")

const User = new mongoose.Schema({
    user_name: String,
    user_id: String,
    session_id: String,
    access_token: String,
    access_token_date: Date,
    last_login_date: Date,
    conversations: [Conversation]
})

module.exports = mongoose.model("User", User)