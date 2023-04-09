const Award = require('../models/awardModel');
const fetch = require('node-fetch')

// Create a new award
exports.create = function (req, res) {
    const award = new Award(req.body);

    fetch(`${process.env.HOST}:${process.env.PORT}/api/gift/${award.ticket}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(async (responseGift) => {
            console.log('3');
            const dataGift = await responseGift.json();
            if (dataGift == null) {
                console.log("Ce ticket n'existe pas");
                return res.status(400).send("Ce ticket n'existe pas");
            } else {
                console.log('award ctreed !!');
                try {
                    award.save(async function (err) {
                        if (err) {
                            console.log('blabla');
                            console.log(err);
                            return res.status(400).send(err);
                        }
                        console.log('award created !!');
                        return res.status(200).json(award);
                    });
                } catch (err) {
                    console.log('2');
                    // return res.status(400).send(err);
                }
            }
        })
        .catch((err) => {
            console.log('1');
            // return res.status(400).send(err);
        });
};

exports.list = function (req, res) {
    const obj = [
        {
            $lookup: {
                from: 'gifts',
                localField: 'ticket',
                foreignField: '_id',
                as: 'ticket',
            },
        },
        {
            $match: {
                // "ticket.ticket": 1000,
            },
        },
        {
            $unwind: {
                path: '$ticket',
            },
        },
    ];

    let findObj = {}
    if (req.params.client) findObj = { client: req.params.client }

    try {
        Award.find(findObj)
            .populate({
                path: 'ticket',
                model: 'Gift',
                options: { lean: true },
                populate: false,
                localField: 'ticket',
                foreignField: 'ticket',
            })
            .exec(function (err, awards) {
                if (err) throw err;
                // check if awards exists
                else if (!awards) res.status(204).json([]);
                else res.status(201).json(awards);
            });
    } catch (err) {
        res.status(500).send(err);
    }
};



exports.listByEmail = function (req, res) {
    fetch(
        `${process.env.HOST}:${process.env.PORT}/api/client/${req.params.client}`
    )
        .then(async (responseClient) => {
            const dataClient = await responseClient.json();
            if (dataClient == null) {
                console.log("Ce client n'existe pas");
                return res.status(400).send("Ce client n'existe pas");
            } else {
                try {
                    Award.find({ client: dataClient[0]._id })
                        .populate({
                            path: 'ticket',
                            model: 'Gift',
                            options: { lean: true },
                            populate: false,
                            localField: 'ticket',
                            foreignField: 'ticket',
                        })
                        .exec(function (err, awards) {
                            if (err) throw err;
                            // check if awards exists
                            else if (!awards) res.status(204).json([]);
                            else {
                                if (awards.length > 0) {
                                    awards[0].client = dataClient[0];
                                }
                                res.status(201).json({awards, client: dataClient[0]});
                            }
                        });
                } catch (err) {
                    res.status(500).send(err);
                }
            }
        })
        .catch((err) => {
            console.log('err', err);
            res.status(500).send(err);
        });

    /*  */
};

// Get a award by Client
exports.findByClient = function (req, res) {
    try {
        Award.findOne({ client: req.body.client }, function (err, award) {
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
        Award.findOneAndUpdate(
            {
                _id: req.params._id,
            },
            req.body,
            {
                new: true,
            },
            function (err, Award) {
                if (err) throw err;
                else res.json(Award);
            }
        );
    } catch (error) {
        res.status(500).send(err);
    }
};
