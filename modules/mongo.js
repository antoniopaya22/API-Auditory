const mongoose = require('mongoose');
const user = require("../models/user")

module.exports = {
    init: () => {
        const mongoDB = process.env.MONGO_URL;
        mongoose.connect(mongoDB, { useNewUrlParser: true })

        mongoose.Promise = global.Promise
        mongoose.set('useCreateIndex', true)

        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'MongoDB connection error:'))
        db.once('open', () => { console.log("Conectado a mongoDB") })
    },

    createUser: (userName, password, rol) => {
        return user.validate(userName, password).then(doc => {
            return new Promise((res, rej) => {
                rej("Usuario ya existente");
            })
        }).catch(err =>{
            return new Promise((res, rej) => {
                user.create({ userName: userName }).then(doc => {
                    doc.setPassword(password)
                    doc.setRol(rol)
                    doc.save().then(() => {
                        res(doc)
                    })
                }).catch(err => {
                    rej(err)
                })
            })
        })
    },

    login: (userName, pass) => {
        return user.validate(userName, pass)
    }

}
