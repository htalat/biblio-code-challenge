const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const config = require('./environment');
const User = require('../models/User');

exports.setup = setup;
exports.isAuthorized = isAuthorized;

function setup(){

    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) =>{
    
       try {
            
            let user = await User.findOne({email});
    
            if(!user || !user.validatePassword(password)) {
                return done(null, false);
            }
    
            return done(null, user);
    
        } catch (error) {
            return done(error);
        }
    
    }));
}

function isAuthorized(req, res, next){

    const token = req.headers.token;

    if (!token) {

        let responseData = {
            status: 'fail',
            data: {
                message: 'not authorized'
            }
        }
        return res.status(403).json(responseData);
    }

    jwt.verify(token, config.JWT_SECRET, (err, data)=>{

        if(err){

            let responseData = {
                status: 'fail',
                data: {
                    message: 'not authorized'
                }
            }
            return res.status(403).json(responseData);   
        }

        req.user_token = data;

        next();

    })
}