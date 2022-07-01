const mongoose = require("../connection.js");

const SessionSchema = new mongoose.Schema({
    session_id: String,
    access_token: String,
    user_id: String,
    user_name: String
})

module.exports = mongoose.model("Session", SessionSchema);