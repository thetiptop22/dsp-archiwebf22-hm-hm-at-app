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
        Gift.findById(req.params.id, function (err, gift) {
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
            label: "Thé Noir 50G",
            value: 2.8,
            quota: 0.5, // 50%
        },
        {
            label: 'Thé vert 14 sachets',
            value: 5.2,
            quota: 0.3, // 30%
        },
        {
            label: 'Thé noir Congou goût Russe 100G Bio',
            value: 8.5,
            quota: 0.15, // 15%
        },
        {
            label: "Bon d'achat 10€",
            value: 10,
            quota: 0.04, // 4%
        },
        {
            label: "Bon d'achat 15€",
            value: 15,
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
    let ticket = 1000;
    // Itérer sur les million de cadeaux et ajouter l'attribut x avec une valeur aléatoire
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
