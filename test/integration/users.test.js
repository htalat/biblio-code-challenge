const chai = require('chai');
const request  = require('supertest');
const mongoose = require('mongoose');
const expect = chai.expect;

const app = require('../../index');

after(async ()=>{
    await mongoose.connection.db.dropDatabase();
})

describe('Users API Tests', function() {

    beforeEach(async function() {
        await mongoose.connection.db.dropDatabase();

        let mockInstituion = {
            "_id" : mongoose.Types.ObjectId("5daf6292fadebe6467fcd729"),
            "name" : "Lahore University Of Management Sciences",
            "url" : "https://lums.edu.pk",
            "email_domain" : "lums.edu.pk"
        }

        await mongoose.connection.db.collection('institutions').insertOne(mockInstituion);

    })

    describe('POST /users/create', function() { 

        it('should give an error - name missing', function(done) {

            let mockUser = {
                "email": "htalat@lums.edu.pk",
                "password": "haha123",
                "role": "student"                
            }

            request(app)
            .post('/users/create')
            .send(mockUser)
            .end(function(err, res) { 
                expect(res.statusCode).to.equal(400); 
                expect(res.body.status).equal('fail');
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.name).to.equal('name is required');
                done(); 
            }); 
        });

        it('should give an error - email missing', function(done) {

            let mockUser = {
                "name": "hassan talat",
                "password": "haha123",
                "role": "student"
            }

            request(app)
            .post('/users/create')
            .send(mockUser)
            .end(function(err, res) { 
                expect(res.statusCode).to.equal(400); 
                expect(res.body.status).equal('fail');
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.email).to.equal('email is required');
                done(); 
            }); 
        });

        it('should give an error - email missing', function(done) {

            let mockUser = {
                "name": "hassan talat",
                "email": "htalat@lums.edu.pk",
                "role": "student"
            }

            request(app)
            .post('/users/create')
            .send(mockUser)
            .end(function(err, res) { 
                expect(res.statusCode).to.equal(400); 
                expect(res.body.status).equal('fail');
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.password).to.equal('password is required');
                done(); 
            }); 
        });

        it('should give an error - role missing', function(done) {

            let mockUser = {
                "name": "hassan talat",
                "email": "htalat@lums.edu.pk",
                "password": "haha123"
            }

            request(app)
            .post('/users/create')
            .send(mockUser)
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400); 
                expect(res.body.status).equal('fail');
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.role).to.equal('role is required');
                done(); 
            }); 
        });

        it('should give an error - institute not added yet', function(done) {

            let mockUser = {
                "name": "hassan talat",
                "email": "htalat@example.com",
                "password": "haha123",
                "role": "student"
            }

            request(app)
            .post('/users/create')
            .send(mockUser)
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400); 
                expect(res.body.status).equal('fail');
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.institute).to.equal('The institute is not added to the system yet');
                done(); 
            });            
        })

        it('should create a student', function(done) {

            let mockUser = {
                "name": "hassan talat",
                "email": "htalat@lums.edu.pk",
                "password": "haha123",
                "role": "student"
            }

            request(app)
            .post('/users/create')
            .send(mockUser)
            .end(function(err, res) { 

                expect(res.statusCode).to.equal(200); 
                expect(res.body.data).to.be.an('object');
                expect(res.body.status).equal('success');
                expect(res.body.data.user).to.be.an('object');
                expect(res.body.data.user).to.have.property('token');
                expect(res.body.data.user).to.have.property('_id');
                expect(res.body.data.user.email).to.equal(mockUser.email);             
                done(); 
            }); 
        });
    });

    describe('POST /users/signin', function() { 

        beforeEach(async function() {

            await mongoose.connection.db.dropDatabase();
    
            let mockUser = {
                "name" : "hassan talat",
                "email" : "htalat@lums.edu.pk",
                "password" : "7d9c3b370b126fbd44a77a75e3e034e76cd41d04149c1d5118a316153cf7e63c3d239c1aecb4914f9a8e5e494ca1149d527940037bf218fd61f15575869fbb97",
                "role" : "student",
                "institute" : mongoose.Types.ObjectId("5daf6292fadebe6467fcd729"),
                "salt" : "10c47dba0f54c002a35473f192712da8",
                "__v" : 0
            }
    
            await mongoose.connection.db.collection('users').insertOne(mockUser);
    
        })

        it('should give a bad request error - field missing', function(done) {

            let mockUser = {
                "email": "htalat@lums.edu.pk",
            }

            request(app)
            .post('/users/signin')
            .send(mockUser)
            .end(function(err, res) { 
                expect(res.statusCode).to.equal(400); 
                done(); 
            }); 
        });

        it('should give a bad request error - field missing', function(done) {

            let mockUser = {
                "password": "haha 123"
            }

            request(app)
            .post('/users/signin')
            .send(mockUser)
            .end(function(err, res) { 
                expect(res.statusCode).to.equal(400); 
                done(); 
            }); 
        });

        it('should give unauthorized error - incorrect password', function(done) {

            let mockUser = {
                "email": "htalat@lums.edu.pk",
                "password": "haha 12"
            }

            request(app)
            .post('/users/signin')
            .send(mockUser)
            .end(function(err, res) {
                expect(res.statusCode).to.equal(401); 
                done(); 
            }); 
        });

        it('should give unauthorized error - incorrect email', function(done) {

            let mockUser = {
                "email": "htalat@lums.edu.pl",
                "password": "haha123"
            }

            request(app)
            .post('/users/signin')
            .send(mockUser)
            .end(function(err, res) { 
                expect(res.statusCode).to.equal(401); 
                done(); 
            }); 
        });

        it('should login and get token', function(done) {

            let mockUser = {
                "email": "htalat@lums.edu.pk",
                "password": "haha123"
            }

            request(app)
            .post('/users/signin')
            .send(mockUser)
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body.status).equal('success');
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.user.email).to.equal(mockUser.email);
                expect(res.body.data.user).to.have.property('token');
                expect(res.body.data.user).to.have.property('_id');
                done(); 
            }); 
        });

    })
});