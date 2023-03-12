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

function isConnected(req, res, next) {
    req.session.admin ? next() : res.sendStatus(401);
}

router.get('/admin/dashboard', isConnected, function (req, res) {
    // send client data to dashboard
    res.locals.admin = req.session.admin;
    res.locals.test = 111;

    res.render('admin/dashboard');
});

module.exports = router;
