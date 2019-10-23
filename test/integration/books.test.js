const chai = require('chai');
const request  = require('supertest');
const mongoose = require('mongoose');
const expect = chai.expect;

const app = require('../../index');

after(async ()=>{
    await mongoose.connection.db.dropDatabase();
})

describe('Books API Tests', function(){

    beforeEach(async function() {
        await mongoose.connection.db.dropDatabase();

        let mockInstitution = {
            "_id" : mongoose.Types.ObjectId("5daf6292fadebe6467fcd729"),
            "name" : "Lahore University Of Management Sciences",
            "url" : "https://lums.edu.pk",
            "email_domain" : "lums.edu.pk"
        }

        let mockBooks = [
            {
                "_id" : mongoose.Types.ObjectId("5dafc81024506ff4c2f2cc89"),
                "title" : "Atom Habits",
                "author" : "Doroteya Esch",
                "ISBN" : "010207613-8",
                "institutes" : [ 
                    {
                        "_id" : mongoose.Types.ObjectId("5daf6292fadebe6467fcd729")
                    }
                ]
            },
            {
                "_id" : mongoose.Types.ObjectId("5dafc81024506ff4c2f2cc8a"),
                "title" : "Design of Every day things",
                "author" : "Jeniece Stanbury",
                "ISBN" : "031596657-2"
            },
            {
                "_id" : mongoose.Types.ObjectId("5dafc81024506ff4c2f2cc8b"),
                "title" : "Stillness and Speed",
                "author" : "Mel Danbi",
                "ISBN" : "717618332-5"
            },
            {
                "_id" : mongoose.Types.ObjectId("5dafc81024506ff4c2f2cc8c"),
                "title" : "Calculus",
                "author" : "Marcille Pickavant",
                "ISBN" : "265130328-3"
            },
            {
                "_id" : mongoose.Types.ObjectId("5dafc81024506ff4c2f2cc8d"),
                "title" : "Deep Work",
                "author" : "Lou Sellen",
                "ISBN" : "167280322-5"
            }]

            let mockUser = {
                "_id" : mongoose.Types.ObjectId("5dafe6f7f55f5d140558f61c"),
                "name" : "hassan talat",
                "email" : "htalat@lums.edu.pk",
                "password" : "7d9c3b370b126fbd44a77a75e3e034e76cd41d04149c1d5118a316153cf7e63c3d239c1aecb4914f9a8e5e494ca1149d527940037bf218fd61f15575869fbb97",
                "role" : "student",
                "institute" : mongoose.Types.ObjectId("5daf6292fadebe6467fcd729"),
                "salt" : "10c47dba0f54c002a35473f192712da8",
                "__v" : 0
            }

        await mongoose.connection.db.collection('institutions').insertOne(mockInstitution);
        await mongoose.connection.db.collection('books').insertMany(mockBooks);
        await mongoose.connection.db.collection('users').insertOne(mockUser);
    })

    describe('GET /books', function() {

        var token = null;

        beforeEach(function(done) {

            let mockUser = {
                "email": "htalat@lums.edu.pk",
                "password": "haha123"
            }

            request(app)
            .post('/users/signin')
            .send(mockUser)
            .end(function(err, res) {
                token = res.body.data.user.token;
                done();
            });
        });

        it('should give an unauthorized error - token missing', function(done) {

            request(app)
            .get('/books')
            .end(function(err, res) { 
                expect(res.statusCode).to.equal(403); 
                expect(res.body.status).equal('fail');
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.message).to.equal('not authorized');
                done(); 
            }); 
        });
  
        it('should give an unauthorized error - wrong token', function(done) {
            let malformedToken = 'adfaf.adqwedq.adfafa';
            request(app)
            .get('/books')
            .set('token', malformedToken)
            .end(function(err, res) { 
                expect(res.statusCode).to.equal(403); 
                expect(res.body.status).equal('fail');
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.message).to.equal('not authorized');
                done(); 
            }); 
        });
 
        it('should return books only for the ones that are attached to a student\'s institute', function(done) {

            request(app)
            .get('/books')
            .set('token', token)
            .end(function(err, res) { 
                expect(res.statusCode).to.equal(200); 
                expect(res.body.status).equal('success');
                expect(res.body.data.books).to.be.an('array');
                expect(res.body.data.books).to.length(1);
                done(); 
            }); 
        });
    
    })
})