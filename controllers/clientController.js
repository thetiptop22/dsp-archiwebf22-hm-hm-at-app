const Client = require('../models/clientModel');

// Create a new client
exports.create = function (req, res) {
    try {
        const client = new Client(req.body);
        client.save(function (err) {
            if (err) res.status(400).send(err);
            else res.json(client);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get all clients
exports.list = function (req, res) {
    try {
        Client.find({}, function (err, clients) {
            if (err) throw err;
            else res.json(clients);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Get client by email
 **/
exports.findbyemail = function (req,res) {
    try {
        Client.findOne({email: req.body.email},function (err, client) {
            if (err) throw err;
            else res.json(client);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Get client to login
 **/
exports.login = function (req,res) {
    try {
        Client.findOne({email: req.body.email,password: req.body.password},function (err, client) {
            if (err) throw err;
            else res.json(client);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};
// Update client by id
exports.update = function (req, res) {
    try {
       Client.findOneAndUpdate({
                _id: req.params.id
            }, req
            .body, {
                new: true
            },
            function (err, client) {
                if (err) throw err;
                else res.json(client);
            });
    } catch (error) {
        res.status(500).send(err);
    }
};