const express = require("express");
const router = express.Router();
const axios = require("axios");
const Session = require('../models/Session')

router.post('/userinfo',(req,res)=> {
    console.log(req.body.session_id)

    Session.findOne({session_id: req.body.session_id})
    .then(session => {
        console.log("session = ", session)
        console.log("session.access_token = ", session.access_token);
        return axios.get("https://api.github.com/user", {headers:{Accept: "application/json", Authorization: `token ${session.access_token}`}})
    })
    .then(response => {
        console.log("response.data =", response.data)
        res.json(response.data)
    })
    .catch(error => {
        console.log("error =", error)
        res.send(error)
    })
})


/*
promiseReturningFunction()
    .then(() => {AnotherPromiseReturningFunction()}) ON SUCCESS DO SOMETHING
    .then(() => {}) ON SUCCESS OF AnotherPromiseReturningFunction()
    .catch() ON FAILURE DO SOMETHING ELSE
*/


module.exports=router;

// axios.get("https://api.github.com/user", {headers:{Accept: "application/json", Authorization: `token ${session.access_token}`}})
// .then(response =>{
//     console.log(response)
//     res.send('working on it')
// })