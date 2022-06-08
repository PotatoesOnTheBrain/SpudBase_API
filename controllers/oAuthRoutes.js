require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Session = require("../models/Session");

router.get("/authorize", (req, res) => {
    axios.get(`https://github.com/login/oauth/access_token?code=${req.query.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`, {headers: {Accept: "application/json"}})
        .then(ires => {
            if (ires.data.error) {
                throw ires.data.error;
            }else {
                let session_id = uuidv4();
                Session.create({
                    session_id: session_id,
                    access_token: ires.data.access_token
                })
                    .then(newSession => {
                        res.json({session_id: newSession.session_id})
                    })
            }
        })
        .catch(e => {
            res.json(e)
        })
})

module.exports = router;