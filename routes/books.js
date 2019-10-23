const routes = require('express').Router();
const mongoose = require('mongoose');

const passportConfig = require('../config/passport');

const Book = require('../models/Book');

routes.get('/', passportConfig.isAuthorized, async (req, res) =>{

    try {

        let books = await Book.find({'institutes._id': mongoose.Types.ObjectId(req.user_token.instituteId)}).select("-institutes");

        let responseData = {
            status: 'success',
            data: {
                books
            }
        }

        return res.status(200).json(responseData);
        
    } catch (error) {

        console.log(error);

        let responseData = {
            status: 'error',
            message: 'Something went wrong'
        }

        return res.status(500).json(responseData);
    }

})

module.exports = routes;