"use strict"
const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require('path');
const priv = fs.readFileSync(path.join(__dirname, "./private.key"))
const pub = fs.readFileSync(path.join(__dirname, "./public.pem"))
const signOpts = {
    algorithm: "RS256",
    expiresIn: "24h"
}

module.exports = {
    isAuth: function (req, res, next) {
        try {
            jwt.verify(req.headers.authorization, pub)
            next()
        } catch (err) {
            res.status(403).send("Invalid authorization: "+err)
        }
    },
    createToken: function (userName) {
        const payload = {
            name: userName
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