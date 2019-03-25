"use strict"
const express = require("express")
let app = express()

let morgan = require("morgan")
app.use(morgan("dev"))

require('dotenv').config()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Authorization,Origin, X-Requested-With, Content-Type, Accept, token");
    next();
});
let bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const RedFabric = require("./utils/fabric/redFabric")
let redFabric = new RedFabric("user1")

let mongo = require("./utils/mongo")
mongo.init()

require("./routes/rdata")(app, redFabric, mongo)

redFabric.init().then(() => {
    
    app.set("port", 23658)
    app.listen(app.get("port"), function () {
        console.log("Active server at port: "+ app.get("port"))
    })

}).catch(err=> {
    console.log("Mal")
})
