require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Session = require("../models/Session");

router.get("/authorize", (req, res) => {
    let session = {};
    axios.get(`https://github.com/login/oauth/access_token?code=${req.query.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`, {headers: {Accept: "application/json"}})
        .then(ires => {
            if(!ires.data) {
                return Promise.reject({error: "failure to fetch response data from github api"})
            }
            if (ires.data.error) {
                return Promise.reject({error: ires.data.error});
            }else {
                let session_id = uuidv4();
                return (Session.create({
                    session_id: session_id,
                    access_token: ires.data.access_token
                }))
            }
        })
        .then(newSession => {
            if (!newSession) {
                return Promise.reject({error: "Failure to create new session, please clear cookies and try again"})
            }
            session = newSession
            res.json({session_id: session.session_id})
            return axios.get("https://api.github.com/user", {headers:{Accept: "application/json", Authorization: `token ${session.access_token}`}})
        })
        .then(response => {
            //TODO handle failure to get userdata after session creation
            if (!response) {
                console.log("failed to associate session_id with user_id")
                return;
            }
            session.user_id = response.data.login;
            session.save();
        })
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

router.get("/authorizemobile", (req, res) => {
    let session = {};
    axios.get(`https://github.com/login/oauth/access_token?code=${req.query.code}&client_id=${process.env.MOBILE_ID}&client_secret=${process.env.MOBILE_SECRET}`, {headers: {Accept: "application/json"}})
        .then(ires => {
            if(!ires.data) {
                return Promise.reject({error: "failure to fetch response data from github api"})
            }
            if (ires.data.error) {
                return Promise.reject({error: ires.data.error});
            }else {
                let session_id = uuidv4();
                return (Session.create({
                    session_id: session_id,
                    access_token: ires.data.access_token
                }))
            }
        })
        .then(newSession => {
            if (!newSession) {
                return Promise.reject({error: "Failure to create new session, please clear cookies and try again"})
            }
            session = newSession
            res.json({session_id: session.session_id})
            return axios.get("https://api.github.com/user", {headers:{Accept: "application/json", Authorization: `token ${session.access_token}`}})
        })
        .then(response => {
            //TODO handle failure to get userdata after session creation
            if (!response) {
                console.log("failed to associate session_id with user_id")
                return;
            }
            session.user_id = response.data.login;
            session.save();
        })
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

module.exports = router;