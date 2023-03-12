const express = require('express');
const router = express.Router();
const passport = require('passport');
router.use(passport.initialize());
router.use(passport.session());

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

router.get(
    '/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure',
    })
);

router.get('/protected', isLoggedIn, async (req, res) => {
    // router.get('/protected', async (req, res) => {
    const googleUser = req.user;
    console.log('googleUser : ' + googleUser.email);
    let client;

    fetch(
        `${process.env.HOST}:${process.env.PORT}/api/client/${googleUser.email}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
        .then(async (response) => {
            if (response.status === 201) {
                console.log('User already exists');
                const data = await response.json();
                client = data[0];
            } else if (response.status === 404) {
                console.log('User does not exist');
                console.log(`email : ${googleUser.email}`);
                console.log(`lastName : ${googleUser.displayName}`);
                try {
                    const response = await fetch(
                        `${process.env.HOST}:${process.env.PORT}/api/client`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: googleUser.email,
                                lastName: googleUser.displayName,
                            }),
                        }
                    );

                    const data = await response.json();
                    client = data
                } catch (error) {
                    console.log(error);
                    throw new Error(error);
                }
            }
        })
        .then(() => {
            console.log(`client : ${JSON.stringify(client)}`);
            console.log(client);
            req.session.client = client
            res.redirect('/dashboard');
        })
        .catch((error) => {
            console.log(error);
            throw new Error(error);
        });
});

router.get('/logout', (req, res) => {
    // req.logout();
    req.session = null
    console.log('session destroyed, GoodBye !');
    res.redirect('/');
});

router.get('/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

module.exports = router;
