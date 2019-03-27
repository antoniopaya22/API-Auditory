let chai = require('chai');
let mocha = require('mocha');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let should = chai.should();
require('dotenv').config()
let mongo = require('../utils/mongo');
mongo.init();
const auth = require("../utils/authentication/authentication")

chai.use(chaiHttp);
const url= 'http://localhost:23658';

mocha.describe('Login: ',function () {
    this.timeout(5000);

	it('Deberia loguearse y devolver el token', (done) => {
		chai.request(url)
			.post('/login')
			.send({userName:"user", password: "user",})
			.end( function(err,res){
				expect(res).to.have.status(200);
				done();
			});
    });
    
});

mocha.describe('Get 1 param: ',function () {
    this.timeout(5000);

	it('Busqueda por id', (done) => {
        var token = auth.createToken(mongo.login("user","user").userName)
		chai.request(url)
			.get('/data?id=ID_PRUEBA_0')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
				done();
			});
    });

    it('Busqueda por temp', (done) => {
        var token = auth.createToken(mongo.login("user","user").userName)
		chai.request(url)
			.get('/data?temp=41')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('Busqueda por lowerTemp', (done) => {
        var token = auth.createToken(mongo.login("user","user").userName)
		chai.request(url)
			.get('/data?lowerTemp=40')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('Busqueda por greaterTemp', (done) => {
        var token = auth.createToken(mongo.login("user","user").userName)
		chai.request(url)
			.get('/data?greaterTemp=40')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('Busqueda por time', (done) => {
        var token = auth.createToken(mongo.login("user","user").userName)
		chai.request(url)
			.get('/data?time=15:40')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

    it('Busqueda por device', (done) => {
        var token = auth.createToken(mongo.login("user","user").userName)
		chai.request(url)
			.get('/data?device=prueba')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });
    
    it('Busqueda por node', (done) => {
        var token = auth.createToken(mongo.login("user","user").userName)
		chai.request(url)
			.get('/data?node=peer0.asturias.arcelormittal.com')
			.set('Authorization',token)
			.end( function(err,res){
                expect(res).to.have.status(200);
                res.body.should.be.a('array');
				done();
			});
    });

});

mocha.describe('Get 2 or + param: ',function () {
    this.timeout(5000);

    it('Busqueda por device e id', (done) => {
        var token = auth.createToken(mongo.login("user","user").userName)
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