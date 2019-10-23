const routes = require('express').Router();

const passport = require('passport');
const User = require('../models/User');
const Institution = require('../models/Institution');


routes.post('/signin', passport.authenticate('local', { session: false }), (req, res) =>{

    let responseData = {
        status: 'success',
        data: {
            user: req.user.toAuthJSON()
        }
    }

    return res.status(200).json(responseData);
})

routes.post('/create', async (req, res) =>{

    const { body: { 
        name,
        email,
        password,
        role
    } } = req;

    if(!name){
        return res.status(400).json({
            status: 'fail',
            data: {
              name: 'name is required'
            }
        });
    }

    if(!email){
        return res.status(400).json({
            status: 'fail',
            data: {
                email: 'email is required'
            },
        });
    }

    if(!password){
        return res.status(400).json({
            status: 'fail',
            data: {
                password: 'password is required'
            },
        });
    }

    if(!role){
        return res.status(400).json({
            status: 'fail',
            data: {
                role: 'role is required'
            }
        });
    }

    try {

        let email_split_array = email.split('@');
        let email_domain = email_split_array[email_split_array.length -1];
        let q = { email_domain };
        let institute = await Institution.findOne(q).lean();

        if(institute === null){

            let responseData = {
                status: 'fail',
                data: {
                    institute: 'The institute is not added to the system yet'
                }
            }

            return res.status(400).json(responseData);
        }

        let newUser = new User({
            name,
            email,
            password,
            role,
            institute: institute._id
        });

        await newUser.save();

    
        let responseData = {
            status: 'success',
            data: {
                user: newUser.toAuthJSON()
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