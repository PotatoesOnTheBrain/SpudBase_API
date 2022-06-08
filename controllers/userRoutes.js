const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get('/userinfo',(req,res)=>{
res.send('some info')

})


module.exports=router;
