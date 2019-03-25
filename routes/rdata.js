"use strict"

const Filter = require("../utils/filter")
const auth = require("../utils/authentication/authentication")

module.exports = function (app, redFabric, mongo) {
    app.post("/register", function (req, res) {
        let userName = "user"
        let password = "user"
        mongo.createUser(userName, password).then(user=>{
            res.send(user)
        }).catch(err=> {
            res.status(500).send("Cant create user :"+err)
        })
    })
    
    app.post("/login", (req, res) => {
        mongo.login(req.body.userName, req.body.password).then(doc => {
            res.send(auth.createToken(doc.userName))
        }).catch(err =>{
            res.status(403).send(err)
        })
    })

    app.get("/data", auth.isAuth, (req, res) => {
        redFabric.queryAllDatos().then(data => {
            const result = (new Filter(data))
                .id(req.query.id)
                .temp(req.query.temp)
                .lowerTemp(req.query.lowerTemp)
                .greaterTemp(req.query.greaterTemp)
                .time(req.query.time)
                .lowerTime(req.query.lowerTime)
                .greaterTime(req.query.greaterTime)
                .device(req.query.device)
                .node(req.query.node)
                .getData()
            res.send(result)
        }).catch(err=> {
            res.status(500).send("Vaya por dios: "+err)
        })
    })

    app.get("/data/devices", auth.isAuth, (req, res) => {
        redFabric.queryAllDatos().then(data => {
            var result = {};
            data.forEach(x => {
                if (result[x.Record.device] == undefined) result[x.Record.device] = x;
                else if(result[x.Record.device] != undefined && parseInt(x.Key.match(/\d+/)[0]) > parseInt(result[x.Record.device].Key.match(/\d+/)[0])) result[x.Record.device] = x;
            });
            res.send(result)
        }).catch(err=> {
            res.status(500).send("Vaya por dios: "+err)
        })
    })

}