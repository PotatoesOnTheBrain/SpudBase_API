const express = require("express")
const router = express.Router()

const Conversation = require("../models/Conversation")
const User = require("../models/User")

//session_id in Authorization header

router.get("/", (req, res) => {
    if (req.header("Authorization") == false) {
        res.status(401).json({errorString: "missing header: Authorization",errorCode: 401})
        return
    }
    User.find({session_id: req.header("Authorization")})
        .then(foundUser => {
            if(foundUser == false) {
                return Promise.reject({errorString: "invalid session_id: log in again",errorCode: 404})
            }
            res.status(200).json(foundUser.conversations)
        })
        .catch(error => {
            console.log(error)
            if (error.errorCode) {
                res.status(error.errorCode).json(error)
            } else {
                res.status(500).json({errorString: "internal error: contact administrator",errorCode: 500})
            }
        })
    
})


router.post("/", (req, res) => {
    if (req.header("Authorization") == false) {
        res.status(401).json({errorString: "missing header: Authorization",errorCode: 401})
        return
    }
    User.find({session_id: req.header("Authorization")}).populate("conversations")
        .then(foundUser => {
            if(foundUser == false) {
                return Promise.reject({errorString: "invalid session_id: log in again",errorCode: 404})
            }
        })
        .catch(error => {
            console.log(error)
            if (error.errorCode) {
                res.status(errorCode).json(error)
            } else {
                res.status(500).json({errorString: "internal error: contact administrator",errorCode: 500})
            }
        })
})