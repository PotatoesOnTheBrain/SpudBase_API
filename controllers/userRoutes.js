const express = require("express");
const router = express.Router();
const axios = require("axios");
const Session = require('../models/Session')

router.post('/userinfo',(req,res)=>{
Session.find({session_id: req.body.session_id})
.then(session =>{
axios.get("https://api.github.com/user", {headers:{Accept: "application/json", Authorization: `token ${session.access_token}`}})
.then(response =>{
    console.log(response)
    res.send('working on it')
})
})

.catch(error => {
    res.send(error)
})
})


module.exports=router;
