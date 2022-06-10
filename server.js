require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(morgan("dev"));
const cors = require('cors');
app.use(cors());
app.options('*', cors())
app.use(express.json());

app.set("port", process.env.PORT || 8080);

app.get("/", (req, res) => {
    res.send("You've found the server!")
});

const messageRouter = require('./controllers/messageRoutes')
app.use('/message/', messageRouter);

const oAuthRouter = require('./controllers/oAuthRoutes.js')
app.use('/oauth/', oAuthRouter);

const userRouter= require('./controllers/userRoutes')
app.use('/user/', userRouter)


app.listen(app.get('port'), () => {
    console.log("Listening on port", app.get('port'));
});