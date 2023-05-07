require('dotenv').config()

const express = require("express");
const app = express();
app.get('/', (req, res) => {
    res.send("Hello world");
})

console.log(process.env.PORT);

app.set('port', process.env.PORT);
app.listen(app.get('port'), () => {
    console.log("Listening to port 8080");
})