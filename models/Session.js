const mongoose = require("../connection.js");

const sessionSchema = new mongoose.Schema({
    session_id: String,
    auth_key: String,
    user_id: String, 
})

module.exports = mongoose.model("Session", sessionSchema);