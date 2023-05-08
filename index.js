require('dotenv').config()
const express = require("express");
const router = require('./routes/router.js');
const { createClient } =require('redis');
const bodyParser = require('body-parser');
const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});
const app = express();
//require('./utils.js').subScribe();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.use('/', router);
app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), () => {
    console.log("Listening to port 8080");
})