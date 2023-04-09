const express = require('express');
const router = express.Router();
const passport = require('passport');
router.use(passport.initialize());
router.use(passport.session());
const bcrypt = require('bcrypt');
const fetch = require('node-fetch')


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
        failureRedirect: '/auth/failure',
    })
);

router.get('/protected', isLoggedIn, async (req, res) => {
    // router.get('/protected', async (req, res) => {
    const googleUser = req.user;
    console.log('googleUser : ' + googleUser.email);
    let client;

    const password = require('generate-password').generate({
        length: 10,
        numbers: true,
    });

    const passwordHashed = await bcrypt.hash(password, 10);


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
                                password: passwordHashed,
                            }),
                        }
                    );

                    const data = await response.json();
                    client = data;
                } catch (error) {
                    console.log(error);
                    throw new Error(error);
                }
            }
        })
        .then(() => {
            console.log(`client : ${JSON.stringify(client)}`);
            console.log(client);
            req.session.client = client;
            res.locals.client = client;

            const mail = {
                title: 'Bienvenue à Thé TipTop',
                content:
                    `<p>Chér client, <br/> <br/> Merci pour votre confiance en Thé Tip Top, vous trouverez ci-dessous vos détails d'authentification <br/> <br/> e-mail: ${client.user.email} <br/> Mot de passe: ${password} <br/> <br/> Vous pouvez également utiliser votre compte gmail pour s'authentfier à votre éspace personnel. <br/> <br/>` +
                    'On vous remercie pour votre confiance. <br/> On vous souhaite une trés bonne chance dans notre jeu concours.' +
                    '</p>',
            };


            fetch(`${process.env.HOST}:${process.env.PORT}/api/mailer/sendMail/${client.user.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mail),
            }).then((ress) => {
                if (ress.status === 200) {
                    res.redirect('/client/Account');
                }
            });
        })
        .catch((error) => {
            console.log(error);
            throw new Error(error);
        });
});

router.get('/admin/logout', (req, res) => {
    // req.logout();
    console.log('teeest');
    req.session.admin = null;
    console.log('admin session destroyed, GoodBye !');
    res.redirect('/');
});

router.get('/client/logout', (req, res) => {
    // req.logout();
    console.log('teeest1');
    req.session.client = null;
    console.log('client session destroyed, GoodBye !');
    res.redirect('/');
});

router.get('/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

router.get("/facebook", passport.authenticate("facebook", { scope : ['email'] })
);

router.get("/facebook/callback", passport.authenticate("facebook",
 { successRedirect: '/auth/facebook/login', 
   failureRedirect: "/failure" })
);

router.get('/facebook/login', isLoggedIn, async (req, res) => {
    const facebookUser = req.user;
    console.log('facebookUser : ' + facebookUser.emails[0].value);
    try {
    const response = await fetch(`${process.env.HOST}:${process.env.PORT}/api/client/${facebookUser.emails[0].value}`, {
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.status === 404) {
        let hashedPwd = bcrypt.hash(password, 10);
        const createUserResponse = await fetch(`${process.env.HOST}:${process.env.PORT}/api/client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: facebookUser.emails[0].value, 
            lastName: facebookUser.displayName,
            password: hashedPwd,
            })
        });

        if (!createUserResponse.ok) {
        throw new Error('Failed to create user');
        }
        const createdUserData = await createUserResponse.json();
        req.session.client = createdUserData;
        res.redirect('/client/Account');
    } else if (response.ok) {
        const data = await response.json();
        const user = data[0];
        req.session.client = user;
        res.redirect('/client/Account');
    } else {
        throw new Error('Failed to fetch user data');
    }
    } catch (error) {
    console.log(error);
    throw new Error(error);
    }
});

module.exports = router;
