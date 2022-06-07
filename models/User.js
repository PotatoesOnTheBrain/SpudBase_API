const mongoose = require("../connection.js");
const Message = require("./Message.js");

const userSchema = new mongoose.Schema({
    receivedMessages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}]
})

module.exports = mongoose.model("User", userSchema);