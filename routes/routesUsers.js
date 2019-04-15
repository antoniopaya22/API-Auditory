"use strict"

const auth = require("../modules/authentication/authentication")

module.exports = function (app, redFabric, mongo) {

    /**
     * POST registrar usuario por defecto
     */
    app.post("/register", function (req, res) {
        let userName = "user";
        let password = "user";
        mongo.createUser(userName, password).then(user=>{
            res.send(user)
        }).catch(err=> {
            res.status(500).json({ error: err.toString() });
        })
    });
    
    /**
     * POST login with user and password
     */
    app.post("/login", (req, res) => {
        mongo.login(req.body.userName, req.body.password).then(doc => {
            res.send(auth.createToken(doc.userName))
        }).catch(err =>{
            res.status(403).json({ error: err.toString() });
        })
    });

}