const mongoose = require('mongoose');

const schema = mongoose.Schema({

    name: {
        type: String
    },
    url: {
        type: String
    },
    email_domain: {
        type: String
    }
})

const InstitutionModel = mongoose.model('Institution', schema, 'institutions');

module.exports = InstitutionModel;