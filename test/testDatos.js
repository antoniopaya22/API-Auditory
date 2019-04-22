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
const url= 'http://localhost:23658';


mocha.describe('Prueba a realizar un Login correcto y uno incorrecto: ',function () {
    this.timeout(5000);

	it('Correct Login', (done) => {
		chai.request(url)
			.post('/login')
			.send({userName:"auditor", password: "auditor",})
			.end( function(err,res){
				expect(res).to.have.status(200);
				done();
			});
    });

	it('Wrong Login', (done) => {
		chai.request(url)
			.post('/login')
			.send({userName:"userX", password: "user",})
			.end( function(err,res){
				expect(res).to.have.status(403);
				done();
			});
    });
    
});

mocha.describe('Prueba a buscar todos los datos: ',function () {
    this.timeout(5000);

    it('Get all data', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName)
        chai.request(url)
            .get('/data')
            .set('Authorization',token)
            .end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });  
});

mocha.describe('Prueba a buscar datos con 1 parametro: ',function () {
    this.timeout(5000);

	it('By id', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName)
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

    it('By temperature', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName)
		chai.request(url)
			.get('/data?temperature=41')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('By lowerTemperature', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName)
		chai.request(url)
			.get('/data?lowerTemperature=40')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('By greaterTemperature', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName)
		chai.request(url)
			.get('/data?greaterTemperature=40')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('By device', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName)
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
    
    it('By node', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName)
		chai.request(url)
			.get('/data?node=peer0.asturias.antonio.com')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

});

mocha.describe('Prueba a buscar datos con 2 o mas parametros: ',function () {
    this.timeout(5000);

    it('By device & id', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName)
        chai.request(url)
            .get('/data?id=ID_PRUEBA_0&device=test')
            .set('Authorization',token)
            .end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });  
    
});


mocha.describe('Prueba a buscar el historial del dato ID_PRUEBA_0: ',function () {
    this.timeout(5000);

    it('Get History', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName)
        chai.request(url)
            .get('/data/history/ID_PRUEBA_0')
            .set('Authorization',token)
            .end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });  
});

mocha.describe('Prueba a buscar todos los devices: ',function () {
    this.timeout(5000);

    it('Get all devices', (done) => {
        var token = auth.createToken(mongo.login("auditor","auditor").userName)
        chai.request(url)
            .get('/data/devices')
            .set('Authorization',token)
            .end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });  
});

mocha.describe('Prueba a obtener un dato mediante una query ',function () {
    this.timeout(5000);

    it('Deberia devolver el ID_PRUEBA_0', (done) => {
		var query = {
			"selector": {
				"_id" : "ID_PRUEBA_0"
			}
        }	
        var token = auth.createToken(mongo.login("auditor","auditor").userName)	
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