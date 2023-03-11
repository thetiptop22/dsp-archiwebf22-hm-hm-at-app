const expres = require('express');
const router = expres.Router();

const { send } = require('../utils/mailer');

router.post('/mailer/sendMail/:email', async (req, res) => {

    const user = { email: req.params.email };
    const { title, content } = req.body;
    /* `<pre>Chér client, \n\nMerci pour votre confiance en Thé Tip Top, vous trouverez ci-dessous vos détails d'authentification \ne-mail: ${user.email} \nMot de passe: ${user.password} \n\n` +
            'On vous remercie pour votre confiance. \nOn vous souhaite une trés bonne chance dans notre jeu.' +
            '</pre>' */
    console.log('user', user);

    try {
        await send(user, title, content);
        await res.status(200).json({ message: 'Email sent' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Email not sent' });
    }
});

module.exports = router;
