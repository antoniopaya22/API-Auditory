let chai = require('chai');
let mocha = require('mocha');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let should = chai.should();
require('dotenv').config()
let mongo = require('../modules/mongo');
mongo.init();
const auth = require("../modules/authentication/authentication")
chai.use(chaiHttp);
const roles = require('../models/roles')
const url= 'http://localhost:23658';


mocha.describe('Datos tests ',function () {
    this.timeout(5000);

    it('Obtener todos los datos.', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
        chai.request(url)
            .get('/data')
            .set('Authorization',token)
            .end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });  

    it('Buscar dato por id existente.', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
		chai.request(url)
			.get('/data?Key=ID_PRUEBA_0')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
				done();
			});
    });

    it('Buscar dato por id no existente.', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
		chai.request(url)
			.get('/data?Key=XXXXX')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
				done();
			});
    });

    it('Buscar datos por temperatura', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
		chai.request(url)
			.get('/data?temperature=41')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('Buscar datos por temperatura minima', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
		chai.request(url)
			.get('/data?lowerTemperature=40')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('Buscar datos por temperatura maxima', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
		chai.request(url)
			.get('/data?greaterTemperature=40')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('Buscar datos por device', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
		chai.request(url)
			.get('/data?device=test')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
				done();
			});
    });

    it('Buscar datos por nodo', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
		chai.request(url)
			.get('/data?node=peer0.asturias.antonio.com')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('Buscar historial de un dato existente dado su id.', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
        chai.request(url)
            .get('/data/history/ID_PRUEBA_0')
            .set('Authorization',token)
            .end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    }); 

    it('Buscar historial de un dato no existente dado su id.', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
        chai.request(url)
            .get('/data/history/ID_PRUEBA_0')
            .set('Authorization',token)
            .end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    }); 

    it('Buscar todos los devices', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName, roles.auditor)
        chai.request(url)
            .get('/data/devices')
            .set('Authorization',token)
            .end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    }); 

    it('Obtener resultado para una consulta CouchDB', (done) => {
		var query = {
			"selector": {
				"_id" : "ID_PRUEBA_0"
			}
        }	
        var token = auth.createToken(mongo.login("auditor","auditor").userName,roles.auditor)	
		chai.request(url)
            .post('/data/query')
            .set('Authorization',token)
			.send(query)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(1);
			done();
			});
	});

});
