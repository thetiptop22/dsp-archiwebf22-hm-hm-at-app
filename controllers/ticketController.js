const Ticket = require('../models/ticketModel');

// Create a new ticket
exports.create = function (req, res) {
    try {
        const ticket = new ticket(req.body);
        ticket.save(function (err) {
            if (err) res.status(400).send(err);
            else res.json(ticket);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};


// Get a ticket by number
exports.findBynumber = function (req, res) {
    try {
        Ticket.findOne({number:req.params.number}, function (err, ticket) {
            if (err) throw err;
            else res.json(ticket);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

