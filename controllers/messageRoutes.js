const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

router.get('/:conversation_id', (req, res)=>{
    let user = {}
    if (req.header("Authorization") == false) {
        res.status(401).json({errorString: "missing header: Authorization",errorCode: 401})
        return
    }
    User.findOne({session_id: req.header("Authorization")})
        .then(foundUser => {
            if (foundUser == false) {
                return Promise.reject({errorString: "invalid session_id: log in again",errorCode: 404})
            }
            user = foundUser
            Conversation.find({_id: req.params.conversation_id}).populate("messages")
        })
        .then(foundConversation => {
            if (foundConversation == false) {
                return Promise.reject({errorString: "invalid conversation id",errorCode: 404})
            }
            if (foundConversation.users.includes(user) == false) {
                return Promise.reject({errorString: "forbidden: user may not access this conversation",errorCode: 403})
            }
            res.status(200).json(foundConversation)
        })
        .catch(error => {
            console.log(error)
            if (error.errorCode) {
                res.status(error.errorCode).json(error)
            }
            res.status(500).json({errorString: "internal error: contact administrator",errorCode: 500})
        })
})

router.post('/:conversation_id', (req, res)=>{
    let user = {}
    let conversation = {}
    if (req.header("Authorization") == false) {
        res.status(401).json({errorString: "missing header: Authorization",errorCode: 401})
        return
    }
    User.findOne({session_id: req.header("Authorization")})
        .then(foundUser => {
            if (foundUser == false) {
                return Promise.reject({errorString: "invalid session_id: log in again",errorCode: 404})
            }
            user = foundUser
            Conversation.find({_id: req.params.conversation_id})
        })
        .then(foundConversation => {
            if (foundConversation == false) {
                return Promise.reject({errorString: "invalid conversation id",errorCode: 404})
            }
            conversation = foundConversation
            if (conversation.users.includes(user) == false) {
                return Promise.reject({errorString: "forbidden: user may not access this conversation",errorCode: 403})
            }
            const newMessage = {
                author: user.user_id,
                body: req.body.body,
                conversation: conversation
            }
            return Messsage.create(newMessage)
        })
        .then(newMessage => {
            if (newMessage == false) {
                return Promise.reject({errorString: "bad message body: verify format and try again",errorCode: 400})
            }
            conversation.messages.push(newMessage)
            conversation.save()
            res.status(200).json(conversation)
        })
        .catch(error => {
            console.log(error)
            if (error.errorCode) {
                res.status(error.errorCode).json(error)
            }
            res.status(500).json({errorString: "internal error: contact administrator",errorCode: 500})
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


module.exports = router;