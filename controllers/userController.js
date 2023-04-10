const User = require('../models/userModel');
const Client = require('../models/clientModel');

const bcrypt = require('bcrypt');

// Create a new user
exports.create = async function (req, res) {
    try {
        const user = new User(req.body);
        await user.save(function (err) {
            if (err) {
                res.status(400).send(err);
                console.log(err);
            } else res.json(user);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

// Create a new client
exports.createClient = async function (req, res) {
    console.log("creating client ...");
    try {
        const user = new User(req.body);
        console.log("use passr", user);
        if(user.password    )
            user.password = await bcrypt.hash(user.password, 10);

        await user.save(async function (err) {
            if (err) {
                res.status(400).send(err);
                console.log(err);
            } else {
                const client = new Client(req.body);
                client.user = user;
                await client.save(function (err) {
                    if (err) throw err;
                    else res.json(client);
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.get = async (req, res) => {
    User.find({}, (err, users) => {
        if (err || users.length === 0) throw new Error('users_notfound' + err);
        res.status(201).json({ users: users });
    }).select('-password -__v');
};

/*
// Get all users
exports.list = function (req, res) {
    try {
        User.find({}, function (err, users) {
            if (err) throw err;
            else res.json(users);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get a user by id
exports.read = function (req, res) {
    try {
        User.findById(req.params.id, function (err, user) {
            if (err) res.status(400).send(err);
            else res.json(user);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a user by id
exports.update = function (req, res) {
    try {
        User.findOneAndUpdate({
                _id: req.params.id
            }, req
            .body, {
                new: true
            },
            function (err, user) {
                if (err) throw err;
                else res.json(user);
            });
    } catch (error) {
        res.status(500).send(err);
    }
};

// Delete a user by id
exports.delete = function (req, res) {
    try {
        User.remove({
            _id: req.params.id
        }, function (err, user) {
            if (err) throw err;
            else res.json({
                message: 'User successfully deleted'
            });
        });
    } catch (err) {
        res.status(500).send(err);
    }


};

*/
