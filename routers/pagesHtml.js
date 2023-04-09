const expres = require('express');
const router = expres.Router();
const fetch = require('node-fetch')

router.get('/login', function (req, res) {
    res.render('login');
});
router.get('/admin/login', function (req, res) {
    res.render('admin/login');
});

router.post('/api/setSession', (req, res) => {
    console.log('admin', req.body.admin);
    req.session.admin = req.body.admin;
    res.status(200).json({ success: true });
});

router.post('/api/client/session', (req, res) => {
    console.log('client', req.body.client);
    req.session.client = req.body.client;
    res.status(200).json({ success: true });
});

function isConnected(req, res, next) {
    req.session.admin ? next() : res.sendStatus(401);
}

function isClientConnected(req, res, next) {
    req.session.client ? next() : res.sendStatus(401);
}

router.get('/downloads/clients', function (req, res) {
    try {
        const Client = require('../models/clientModel');

        Client.find(async function (err, result) {
            if (err) throw err;
            else {
                const clients = result.map((client) => {
                    return {
                        firstname: client.firstname ? client.firstname : '-',
                        lastName: client.user.lastName
                            ? client.user.lastName
                            : '-',
                        email: client.user.email ? client.user.email : '-',
                        birthDate: client.birthDate ? client.birthDate : '-',
                    };
                });

                res.setHeader('Content-Type', 'text/csv');
                res.setHeader(
                    'Content-Disposition',
                    'attachment; filename="clients.csv"'
                );

                const ObjectsToCsv = require('objects-to-csv');
                const csv = new ObjectsToCsv(clients);
                res.send(await csv.toString());
            }
        }).populate('user');
    } catch (err) {
        console.log({ err });
        res.status(500).send(err);
    }
});

router.get('/admin/dashboard', isConnected, function (req, res) {
    // send client data to dashboard
    res.locals.admin = req.session.admin;

    res.render('admin/dashboard');
});


// router.get("admin/tirage" , require("../controllers/pagesHtml"))
router.get('/admin/statistiques', isConnected, async function (req, res) {
    // send client data to dashboard
    res.locals.admin = req.session.admin;

    fetch(`${process.env.HOST}:${process.env.PORT}/api/awards`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then(async (data) => {
            const stats = {
                participants: [],
                gainsEURTotal: 0,
                gains: 0,
                tauxParticipation: 0,
            };

            if (data.length == 0) return res.render('statistiques');
            else {
                data.forEach((award) => {
                    if (!stats.participants.includes(award.client))
                        stats.participants.push(award.client);

                    stats.gainsEURTotal += award.ticket.value;
                });
                stats.gains = data.length;
                stats.tauxParticipation =
                    (stats.gains / stats.participants.length) * 100;
                res.locals.stats = stats;
                return res.render('statistiques');
            }
        });
});

router.get('/client/Account', isClientConnected, async function (req, res) {
    res.locals.client = req.session.client;
    console.log('client ::', res.locals.client);
    const userId = res.locals.client._id.toString();
    const response = await fetch(
        `${process.env.HOST}:${process.env.PORT}/api/awards/${userId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    const data = await response.json();
    res.locals.awards = data;
    if (req.query.ticket_added)
        res.locals.ticket_added = req.query.ticket_added;
    res.render('client/account');
});

module.exports = router;
