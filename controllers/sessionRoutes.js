const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const Session = require("../models/Session");

router.get("/", (req, res) => {
    let session_id = uuidv4();
    Session.create({session_id: session_id})
        .then(newSessionObj => res.json(newSessionObj))
})

router.get("/:session_id", (req, res) => {
    if (req.params.session_id.length !== 36) {
        res.json({
            isActiveSession: false,
            msg: "Invalid parameter, check len"
        })
        return;
    }
    Session.findOne({session_id: req.params.session_id})
        .then(sessionQueryObj => {
            console.log(sessionQueryObj);
            res.json(sessionQueryObj);
            // if (!sessionQueryObj.session_id) {
            //     res.json({
            //         isActiveSession: false,
            //         msg: "Invalid session_id, engage new session"
            //     });
            //     return;
            // }
            // if (!sessionQueryObj.auth_key) {
            //     res.json({
            //         isActiveSession: false,
            //         msg: "User not logged in, prompt OAuth"
            //     });
            //     return;
            // }
            // res.json({
            //     isActiveSession: true,
            //     session: sessionQueryObj,
            //     msg: "Active Session"
            // });
        })
})

router.post("/:session_id", (req, res) => {

})

module.exports = router;