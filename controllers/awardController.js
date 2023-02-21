const Award = require('../models/awardModel');

// Create a new award
exports.create = function (req, res) {
    try {
        const award = new Award(req.body);
        award.save(function (err) {
            if (err) res.status(400).send(err);
            else res.json(award);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};


// Get a award by Client
exports.findByClient = function (req, res) {
    try {
        Award.findOne({client: req.body.client}, function (err, award) {
            if (err) throw err;
            else res.json(award);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update a award by id
exports.update = function (req, res) {
    try {
        Award.findOneAndUpdate({
                _id: req.params.id
            }, req
            .body, {
                new: true
            },
            function (err, Award) {
                if (err) throw err;
                else res.json(Award);
            });
    } catch (error) {
        res.status(500).send(err);
    }
};
// Update a award by admin
exports.update = function (req, res) {
    try {
        Award.findOneAndUpdate({
                admin: req.params._admin
            }, req
            .body, {
                new: true
            },
            function (err, Award) {
                if (err) throw err;
                else res.json(Award);
            });
    } catch (error) {
        res.status(500).send(err);
    }
};
