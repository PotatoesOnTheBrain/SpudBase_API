const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Message = require('../models/Message');

router.get("/:session_id", (req, res) => {
    let user = {}
    // get userid by session_id
    User.findOne({session_id: req.params.session_id})
        .then(foundUser => {
            if (!foundUser) {
                return Promise.reject({error: "invalid session id"})
            }
            user = foundUser
            return Message.find({
                $or:[
                    {author: foundUser.user_id},
                    {receivers: foundUser.user_id}
                ]
            })
        })
        .then(messageResults => {
            let messages = messageResults.map((value)=>{
                let newMessage = {
                    author: value.author,
                    receivers: value.receivers,
                    subject: value.subject,
                    body: value.body,
                    creation_date: value.creation_date,
                    _id: value._id,
                    canDelete: (user.user_id === value.author)
                }
                return newMessage
            })
            res.json({messages:messages});
        })
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

router.post('/:session_id', (req, res)=>{
    User.findOne({session_id: req.params.session_id})
        .then(foundUser => {
            if (!foundUser) {
                return Promise.reject({error: "invalid session id"})
            }
            const newMessage = {
                author: foundUser.user_id,
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
})

router.patch("/:session_id/:message_id", (req, res) => {
    let session = {}
    Session.findOne({session_id: req.params.session_id})
    .then(foundSession => {
        if (!foundSession) {
            return Promise.reject({error: "invalid session id"})
        }
        session = foundSession;
        return Message.findById(req.params.message_id)
    })
    .then(messageToUpdate => {
        if(!messageToUpdate) {
            return Promise.reject({error: "unable to find message with that id"})
        }
        if(messageToUpdate.author !== session.user_id) {
            return Promise.reject({error: "insuficient authority, author of requested message does not match current user"})
        }
        return Message.findByIdAndUpdate(req.params.message_id, {body: req.body.body}, {new: true})
    })
    .then(updatedMessage => {
        if(!updatedMessage) {
            return Promise.reject({error: "unable to update message at this time, please try again later"})
        }
        res.json({updatedMessage: updatedMessage})
    })
    .catch(error => {
        console.log(error);
        res.send(error);
    })
})
// Message.findByIdAndDelete(req.params.id)
// .then(deletedMessage =>{
//     res.json(deletedMessage)
// })


module.exports = router;