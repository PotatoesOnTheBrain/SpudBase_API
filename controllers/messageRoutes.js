const express = require("express");
const router = express.Router();

const Message = require('../models/Message');

router.get('/to/:userId', (req,res)=>{
//need to factor in private setting
Message.find({receivers:req.params.userId})
.then(messagequery => {
res.json(messagequery)
})
})

router.get('/from/:userId', (req,res)=>{
Message.find({author:req.params.userId})
.then(messagequery => {
res.json(messagequery)
})
})

router.post('/', (req, res)=>{
//need to factor in author validation
    const newMessage = {
        author: req.body.author,
        receivers: req.body.receivers,
        subject: req.body.subject,
        body: req.body.body,
        isPrivate: req.body.isPrivate
    }
    Message.create(newMessage)
    .then(newMessage =>{
        res.json(newMessage)
    })
})

router.delete('/:id', (req, res)=>{
Message.findByIdAndDelete(req.params.id)
.then(deletedMessage =>{
    res.json(deletedMessage)
})

})

module.exports = router;