const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const config = require('../config/environment');

const schema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        lowercase: true, 
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    role: {
        type: String,
        enum: ['student', 'academic', 'administrator'],
        required: [true, 'can not be blank'], 
    },
    institute: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Institution'
    }
})

schema.plugin(uniqueValidator);

schema.pre('save', function save(next) {

    const user = this;

    if (!user.isModified('password')) { 
        return next(); 
    }
    
    try {

        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto.pbkdf2Sync(user.password, this.salt, 10000, 64, 'sha512').toString('hex');

        next();

    } catch (error) {
        next(error);        
    }

});

schema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.password === hash;
};

schema.methods.generateJWT = function() {
  
    return jwt.sign({
        id: this._id,        
        email: this.email,
        role: this.role,
        instituteId: this.institute.toString()
    }, config.JWT_SECRET);
}
  
schema.methods.toAuthJSON = function() {
    return {
      _id: this._id,
      email: this.email,
      token: this.generateJWT(),
    };
};

const model = mongoose.model('User', schema, 'users');

module.exports = model;