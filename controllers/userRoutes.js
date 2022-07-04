const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User")

// session_id should always be in Authorization header
// router.get('/userinfo',(req,res)=> {
//     seesion_id = req.header("session_id")
//     User.findOne({session_id: session_id})
//     .then(foundUser => {
//         if (!foundUser) {
//             return Promise.reject({error: "Invalid session id"})
//         }
//         return axios.get("https://api.github.com/user", {headers:{Accept: "application/json", Authorization: `token ${foundUser.access_token}`}})
//     })
//     .then(response => {
//         if(!response.data) {
//             return Promise.reject({error: "failure to fetch response data from github api"})
//         }
//         res.json(response.data)
//     })
//     .catch(error => {
//         console.log("error =", error)
//         res.send(error)
//     })
// })
router.get("/", (req, res) => {
    if (req.header("Authorization") == false) {
        res.status(401).json({errorString: "missing header: Authorization",errorCode: 401})
        return
    }
    User.findOne({session_id: session_id})
        .then(foundUser => {
            if (foundUser == false) {
                return Promise.reject({errorString: "invalid session_id: log in again",errorCode: 404})
            }
            return axios.get("https://api.github.com/user", {headers:{Accept: "application/json", Authorization: `token ${foundUser.access_token}`}})
        })
        .then(response => {
            if (response.data == false) {
                return Promise.reject({errorString: "external error: try again later",errorCode: 500})
            }
            res.json(response.data)
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

module.exports=router;