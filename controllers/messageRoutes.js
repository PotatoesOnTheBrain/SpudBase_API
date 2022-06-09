const express = require("express");
const router = express.Router();

const Session = require("../models/Session");

const Message = require('../models/Message');

router.get("/:session_id", (req, res) => {
    // get userid by session_id
    Session.findOne({session_id: req.params.session_id})
        .then(foundSession => {
            if (!foundSession) {
                return Promise.reject({error: "invalid session id"})
            }
            return Message.find({
                $or:[
                    {author: foundSession.user_id},
                    {receivers: foundSession.user_id}
                ]
            })
        })
        .then(messages => {
            res.json({messages: messages});
        })
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

router.post('/:session_id', (req, res)=>{
    Session.findOne({session_id: req.params.session_id})
        .then(foundSession => {
            if (!foundSession) {
                return Promise.reject({error: "invalid session id"})
            }
            const newMessage = {
                author: foundSession.user_id,
                receivers: req.body.receivers,
                subject: req.body.subject,
                body: req.body.body
            }
            return Message.create(newMessage);
        })
        .then(newMessage => {
            res.json(newMessage)
        })
        .catch(error => {
            console.log(error);
            res.send(error);
        })
})

router.delete('/:session_id/:message_id', (req, res)=>{
    let session = {}
    Session.findOne({session_id: req.params.session_id})
    .then(foundSession => {
        if (!foundSession) {
            return Promise.reject({error: "invalid session id"})
        }
        session = foundSession
        return Message.findById(req.params.message_id)
    })
    .then(messageToDelete => {
        if (!messageToDelete) {
            return Promise.reject({error: "unable to find message with that id"})
        }
        if (messageToDelete.author !== session.user_id) {
            return Promise.reject({error: "insufficient authority, author of requested message does not match current user"})
        }
        return Message.findByIdAndDelete(req.params.message_id)
    })
    .then(deletedMessage => {
        if (!deletedMessage) {
            return Promise.reject({error: "Unable to delete message, try again later"})
        }
        res.json({deletedMessage: deletedMessage});
    })
    .catch(error => {
        console.log(error);
        res.send(error);
    })
// Message.findByIdAndDelete(req.params.id)
// .then(deletedMessage =>{
//     res.json(deletedMessage)
// })
})

module.exports = router;