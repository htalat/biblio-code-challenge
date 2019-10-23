const mongoose = require('mongoose');

const schema = mongoose.Schema({

    title: {
        type: String
    },
    author: {
        type: String
    },
    ISBN: {
        type: String
    },
    institutes: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Institution'
    }]
})

const Book = mongoose.model('Book', schema, 'books');

module.exports = Book;