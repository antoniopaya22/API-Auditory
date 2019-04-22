"use strict"

const auth = require('../modules/authentication/authentication');
const roles = require('../models/roles.js');

module.exports = function (app, redFabric, mongo) {

    /**
     * POST registrar usuario por defecto
     */
    app.post("/registerGestor", function (req, res) {
        let userName = "gestor";
        let password = "gestor";
        let rol = roles.gestor_usuarios;
        mongo.createUser(userName, password, rol).then(user=>{
            res.send(user)
        }).catch(err=> {
            res.status(500).json({ error: err.toString() });
        })
    });

    /**
     * POST registrar usuario por defecto
     */
    app.post("/registerAuditor", auth.isGestorAuth, function (req, res) {
        let userName = req.body.userName;
        let password = req.body.password;
        let rol = roles.auditor;
        mongo.createUser(userName, password, rol).then(user=>{
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
            res.send(auth.createToken(doc.userName, doc.rol))
        }).catch(err =>{
            res.status(403).json({ error: err.toString() });
        })
    });

}