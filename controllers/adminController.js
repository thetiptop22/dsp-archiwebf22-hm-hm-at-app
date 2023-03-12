const { resolve } = require('path');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');

// Create a new admin
exports.create = function (req, res) {
    try {
        const admin = new Admin(req.body);
        admin.save(function (err) {
            if (err) res.status(400).send(err);
            else res.json(admin);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Get Admin By login
 **/
const findEmail = (email) => {
    const obj = [
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $match: {
                'user.email': email,
            },
        },
        {
            $unwind: {
                path: '$user',
            },
        },
    ];

    return Admin.aggregate(obj);
};

exports.findbyemail = function (req, res) {
    try {
        findEmail(req.params.email).exec(function (err, admin) {
            if (err) throw err;
            // check if client exists
            else if (admin.length === 0)
                res.status(404).json("admin not found");
            else res.status(201).json(admin);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};


const NEW_ADMIN = {
    user: {
        lastName: 'Admin',
        email: 'admin@gmail.com',
    },
    role: 'admin',
};

const NEW_EMPLOYE = {
    user: {
        lastName: 'Admin',
        email: 'employe@gmail.com',
    },
    role: 'employe',
};

exports.initAdmins = async function (req, res) {
    // Create a new admin
    const passwordHashed = await bcryptjs.hashSync('admin@@', 10);
    NEW_ADMIN.user.password = passwordHashed;

    console.log('creating admin and employe ...');
    try {
        // admin
        const user1 = new User(NEW_ADMIN.user);
        await user1.save(async function (err) {
            if (err) {
                res.status(400).send(err);
                console.log(err);
            } else {
                const admin = new Admin(NEW_ADMIN);
                admin.user = user1;
                await admin.save(function (err) {
                    if (err) throw err;
                    else resolve()
                });
            }
        });

        // employe
        const user2 = new User(NEW_EMPLOYE.user);
        await user2.save(async function (err) {
            if (err) {
                res.status(400).send(err);
                console.log(err);
            } else {
                const admin = new Admin(NEW_EMPLOYE);
                admin.user = user2;
                await admin.save(function (err) {
                    if (err) throw err;
                    else res.json(admin);
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
