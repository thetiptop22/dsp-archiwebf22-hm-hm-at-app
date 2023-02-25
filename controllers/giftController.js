const Gift = require('../models/giftModel');

// Create a new gift
exports.create = function (req, res) {
    try {
        const gift = new Gift(req.body);
        gift.save(function (err) {
            if (err) res.status(400).send(err);
            else res.json(gift);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};


// Get a gift by id
exports.read = function (req, res) {
    try {
        Gift.findById(req.params.id, function (err, gift) {
            if (err) res.status(400).send(err);
            else res.json(gift);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};



