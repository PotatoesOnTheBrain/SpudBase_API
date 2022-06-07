const mongoose = require("../connection.js");
const User = require("./User.js");

const sessionSchema = new mongoose.Schema({
    session_id: String,
    auth_key: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
})

module.exports = mongoose.model("Session", sessionSchema);