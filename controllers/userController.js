const User = require('../models/userModel');

// Create a new user
exports.create = function (req, res) {
    try {
        const user = new User(req.body);
        user.save(function (err) {
            if (err) res.status(400).send(err);
            else res.json(user);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

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

