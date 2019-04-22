"use strict"
const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require('path');
const roles = require('../../models/roles.js');
const priv = fs.readFileSync(path.join(__dirname, "./private.key"))
const pub = fs.readFileSync(path.join(__dirname, "./public.pem"))
const signOpts = {
    algorithm: "RS256",
    expiresIn: "24h"
}

module.exports = {
    isAuth: function (req, res, next) {
        try {
            jwt.verify(req.headers.authorization, pub, function(err, decoded) {
                if(decoded.rol === roles.auditor) next();
                else  res.status(403).send("Invalid authorization: Usuario no es empleado de la base de datos local");
            });
        } catch (err) {
            res.status(403).send("Invalid authorization: "+err)
        }
    },
    isGestorAuth: function (req, res, next) {
        try {
            jwt.verify(req.headers.authorization, pub, function(err, decoded) {
                if(decoded.rol === roles.gestor_usuarios) next();
                else  res.status(403).send("Invalid authorization: Usuario no es gestor de usuarios");
            });
        } catch (err) {
            res.status(403).send("Invalid authorization: "+err)
        }
    },
    createToken: function (userName, rol) {
        const payload = {
            name: userName,
            rol: rol
        }
        return jwt.sign(payload, priv, signOpts)
    },
    verifyToken: function (token) {
        try {
            return jwt.verify(token, pub)
        } catch (err) {
            return null
        }
    },
}