const {
    check
} = require('express-validator');
const User = require('../models/userModel');


// validate User
module.exports.validateUser = [
    check('Last name').isLength({
        min: 1
    }).withMessage('Last name is required'),

    check('email').isLength({
        min: 1
    }).withMessage('Email is required'),
    check('password').isLength({
        min: 1
    }).withMessage('Password is required'),
    check('email').custom(async (value) => {
        const
            user = await User.findOne({
                email: value
            });
        if (user) {
            throw new Error('Email already exists');
        }
    })
]
