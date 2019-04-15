"use strict"

const Filter = require("../modules/filter")
const auth = require("../modules/authentication/authentication")

module.exports = function (app, redFabric, mongo) {

    /**
     * GET all data with filters in params
     * Filter in local
     */
    app.get("/data", auth.isAuth, (req, res) => {
        redFabric.queryAllDatos().then(data => {
            const result = (new Filter(data))
                .id(req.query.Key)
                .temp(req.query.temperature)
                .lowerTemp(req.query.lowerTemperature)
                .greaterTemp(req.query.greaterTemperature)
                .device(req.query.device)
                .node(req.query.node)
                .getData()
            res.send(result);
        }).catch(err=> {
            res.status(500).json({ error: err.toString() });
        })
    });

    /**
     * GET get all devices
     * Filter in local
     */
    app.get("/data/devices", auth.isAuth, (req, res) => {
        redFabric.queryAllDatos().then(data => {
            var result = {};
            data.forEach(x => {
                if (result[x.Record.device] == undefined) result[x.Record.device] = x;
                else if(result[x.Record.device] != undefined && parseInt(x.Key.match(/\d+/)[0]) > parseInt(result[x.Record.device].Key.match(/\d+/)[0])) result[x.Record.device] = x;
            });
            res.send(result);
        }).catch(err=> {
            res.status(500).json({ error: err.toString() });
        })
    });

    /**
     * GET history from data by id
     * Filter in blockchain
     */
    app.get("/data/history/:id",auth.isAuth,function(req,res){
        var id=req.params.id;
        redFabric.queryHistory(id).then(data=>{
            res.status(200).json(data);
        }).catch(err=>{
            res.status(500).json({ error: err.toString() });
        });
    });

    /**
     * POST send query to CouchDB
     * Filter in blockchain
     */
    app.post("/data/query", function (req, res) {
        redFabric.init().then(function () {
            var consulta = req.body;
            return redFabric.fantasticQuery(JSON.stringify(consulta));
        }).then(function (data) {
            res.status(200).json(data)
        }).catch(function (err) {
            res.status(500).json({ error: err.toString() });
        })
    });

}