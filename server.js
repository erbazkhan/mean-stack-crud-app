const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static(__untitled + '/CSSs'));
app.use("/", (req, res) => {
    res.sendFile("index.css")
})

//=======================================================================
//******************  POST API  ************************
//=======================================================================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const port = process.env.PORT || 3000;

//POST
app.post('/api/users', function(req, res) {
    const user_name = req.body.user_name;
    const user_mail = req.body.user_mail;
    const user_phone = req.body.user_phone;
    //console.log(req.body)
    res.send(user_name + ' ' + user_mail + ' ' + user_phone);
})

//starting the server
app.listen(port);
console.log("Running at port 3000...");