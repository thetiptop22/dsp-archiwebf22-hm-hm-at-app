const Gift = require('../models/giftModel');

// Create a new gift
exports.create = function (req, res) {
    try {
        const gift = new Gift(req.body);
        gift.save(function (err) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            } else res.json(gift);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

// Get a gift by id
exports.read = function (req, res) {
    try {
        Gift.findOne({ticket:req.params.number}, function (err, gift) {
            if (err) res.status(400).send(err);
            else res.json(gift);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.initGifts = async function (req, res) {
    const GIFTS = [
        {
            label: "Infuseur à thé",
            value: 2.8,
            quota: 0.6, // 50%
        },
        {
            label: 'Boite de 100g d’un thé détox ou d’infusion',
            value: 5.2,
            quota: 0.2, // 30%
        },
        {
            label: 'Boite de 100g d’un thé signature',
            value: 8.5,
            quota: 0.1, // 15%
        },
        {
            label: "Un coffret découverte d’une valeur de 39€",
            value: 39,
            quota: 0.06, // 4%
        },
        {
            label: "Un coffret découverte d’une valeur de 69€",
            value: 69,
            quota: 0.01, // 1%
        },
    ];

    const totalQuotas = GIFTS.reduce((acc, cur) => acc + cur.quota, 0);

    console.log("totalQuotas", totalQuotas);
    // Fonction pour choisir aléatoirement une valeur en fonction des quotas
    function getRandomGiftValue() {
        const rand = Math.random() * totalQuotas;
        let total = 0;
        for (const gift of GIFTS) {
            total += gift.quota;
            if (rand < total) {
                return gift;
            }
        }
    }

    const myGifts = [];
    let ticket = 1000000000;
    // for (let i = 1; i <= 1500000; i++) {
    for (let i = 1; i <= 1000000; i++) {
            const gift = {...getRandomGiftValue()};
        gift.ticket = ticket++;
        myGifts.push(gift);

    }


    try {
        await Gift.collection.insert(myGifts, function (err, docs) {
            if (err) {
                res.status(400).send(err);
            } else {
                console.log('Multiple documents inserted to Collection');
                res.status(200).json({ success: true, docs: myGifts.length });
            }
        });
        // res.status(200).json(myGifts);
    } catch (err) {
        res.status(500).send(err);
    }
};
