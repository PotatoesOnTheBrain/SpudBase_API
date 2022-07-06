require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require("../models/User");

/* GET /authorize
Endpoint for OAuth authorization for Spudbase client. Redirect URL points to web: Spudbase.com
*/

router.get("/authorize", (req, res) => {
    // create user variable to later store reference to User instance
    let user = {};

    //attempt authorization through Github using client_id, client_secret, and the code from the oauth login process
    axios.get(`https://github.com/login/oauth/access_token?code=${req.query.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`, {headers: {Accept: "application/json"}})
        .then(ires => {
            // if we don't get response data, send back an error to front end
            if(!ires.data) {
                return Promise.reject({error: "failure to fetch response data from github api"})
            }
            // if we get an error, send it to front end
            if (ires.data.error) {
                return Promise.reject({error: ires.data.error});
            }else { // if all is well
                //generate unique UUID standard session_id
                let session_id = uuidv4();
                // Return promise to create a new User linking the session_id with the access_token
                return (User.create({
                    session_id: session_id,
                    access_token: ires.data.access_token,
                    last_login: Date.now()
                }))
            }
        })
        .then(newUser => {
            if (!newUser) {
                return Promise.reject({error: "Failure to create new user session, please clear cookies and try again"})
            }
            //store local reference to the new user for later use.
            user = newUser
            return axios.get("https://api.github.com/user", {headers:{Accept: "application/json", Authorization: `token ${user.access_token}`}})
        })
        .then(response => {
            if (!response) {
                return Promise.reject({error: "Failure to retrieve userInfo with access_token"});
            }
            user.user_name = response.data.login;
            user.user_id = response.data.id;
            user.save();
            res.status(200).json({session_id: user.session_id, user_name: user.user_name, user_id: user.user_id})
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

/* GET /authorize
Endpoint for OAuth authorization for Spudbase client. Redirect URL points to app: spudbase://
*/

router.get("/authorizemobile", (req, res) => {
    let user = {};
    axios.get(`https://github.com/login/oauth/access_token?code=${req.query.code}&client_id=${process.env.MOBILE_ID}&client_secret=${process.env.MOBILE_SECRET}`, {headers: {Accept: "application/json"}})
        .then(ires => {
            if(ires.data == false) {
                return Promise.reject({error: "failure to fetch response data from github api"})
            }
            if (ires.data.error) {
                return Promise.reject({error: ires.data.error});
            }else {
                let session_id = uuidv4();
                return (User.create({
                    session_id: session_id,
                    access_token: ires.data.access_token,
                    auth_token_acquired: Date.now(),
                    last_login: Date.now()
                }))
            }
        })
        .then(newUser => {
            if (newUser == false) {
                return Promise.reject({error: "Failure to create new user session, please clear cookies and try again"})
            }
            user = newUser
            return axios.get("https://api.github.com/user", {headers:{Accept: "application/json", Authorization: `token ${user.access_token}`}})
        })
        .then(response => {
            if (response == false) {
                return Promise.reject({error: "Failure to retrieve userInfo with access_token"});
            }
            user.user_name = response.data.login;
            user.user_id = response.data.id;
            user.save();
            res.status(200).json({session_id: user.session_id, user_name: user.user_name, user_id: user.user_id})
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

module.exports = router;