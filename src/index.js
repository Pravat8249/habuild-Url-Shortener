const express = require('express');
const mongoose = require("mongoose");
const route = require('./route/route');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://Pratice:MVLNdVEz62Td6t7j@cluster0.q9vy5.mongodb.net/urlShortner", {
    useNewUrlParser: true
}).then(() => console.log("MongoDb is connected")).catch(err => console.log(err));


app.use('/', route);

app.all('*', function(req, res) {
    throw new Error("Bad request")
})

app.use(function( req, res, next) {
    if (e.message === "Bad request") {
        res.status(400).send({status : false , error: e.message});
    }
});


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
