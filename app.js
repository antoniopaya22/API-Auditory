"use strict"
/**                                                                          
 *
 *    ===========================================================================
 *    Aplicacion realizada en NodeJS que se conecta con una red Hyperledger Fabric
 *    ======================
 *    @author Antonio Paya
 *
 */

const express = require("express")
const RedFabric = require("./utils/fabric/redFabric")
let app = express()
let morgan = require("morgan")
let bodyParser = require('body-parser')
let mongo = require("./utils/mongo")
require('dotenv').config()

//==========VARIABLES===============
app.set("port", 23658)
let redFabric = new RedFabric("user1")

//==========INICIACION=============
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Authorization,Origin, X-Requested-With, Content-Type, Accept, token");
    next();
});
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
mongo.init()

//==========RUTAS================
require("./routes/rdata")(app, redFabric, mongo)

//===========RUN===============
// Lanza el servidor
redFabric.init().then(() => { 
    app.listen(app.get("port"), function () {
        console.log("===================================");
        console.log("API - AUDITORY ");
        console.log("===================================");
        console.log("Autor: Antonio Paya Gonzalez");
        console.log("Servidor activo en el puerto: " + app.get("port"));
    })

}).catch(err=> {
    console.log("Error al conectarse con la blockchain")
})
