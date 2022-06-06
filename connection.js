const mongoose = require('mongoose')
let mongoURI = "mongodb://127.0.0.1:27017/spudbasedb"

if (process.env.NODE_ENV === "production") {
    mongoURI = process.env.DB_URI 
}

mongoose.connect(mongoURI)

module.exports = mongoose 