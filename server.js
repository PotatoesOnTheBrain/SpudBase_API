require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(morgan("dev"));
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.set("port", process.env.PORT || 8080);

app.get("/", (req, res) => {
    res.send("You've found the server!")
});

const sessionRouter = require("./controllers/sessionRoutes");
app.use("/session/", sessionRouter);

app.listen(app.get('port'), () => {
    console.log("Listening on port", app.get('port'));
});