const expres = require('express');
const router = expres.Router();

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

router.get('/admin/dashboard', isConnected, function (req, res) {
    // send client data to dashboard
    res.locals.admin = req.session.admin;

    res.render('admin/dashboard');
});

router.get('/admin/statistiques', isConnected, function (req, res) {
    // send client data to dashboard
    res.locals.admin = req.session.admin;

    res.render('statistiques');
});

router.get('/client/Account', isClientConnected, async function (req, res) {
    res.locals.client = req.session.client;
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
    if(req.query.ticket_added)
        res.locals.ticket_added = req.query.ticket_added;
    res.render('client/account');
});

module.exports = router;
