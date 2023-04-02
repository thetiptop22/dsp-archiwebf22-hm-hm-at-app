const nodemailer = require('nodemailer');
var transporter;
const EMAIL_G = process.env.EMAIL_G;
const from = process.env.PLATEFORME_NAME + ' <' + EMAIL_G + '>'; // sender address

let auth = {};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const GOOGLE_REDIRECT_UI = process.env.GOOGLE_REDIRECT_UI;
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// create the OAuth2 client
const oauth2Client = new OAuth2(
    GOOGLE_CLIENT_ID, // Client Secret
    GOOGLE_CLIENT_SECRET, // Client ID
    GOOGLE_REDIRECT_UI // Redirect URL
);

// authenticate the client
oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
});

/*

/* ***************** INIT MAILER **************** */
const init = async (user) => {
    console.log('sending mail to %s ', user.email);
    console.log('process.env.NODE_ENV ==> %s ', process.env.NODE_ENV);
    console.log('process.env.HOST ==> %s ', process.env.HOST);

    if (process.env.NODE_ENV == "production" || 1 == 1 ) {
    // if (process.env.NODE_ENV == 'production') {
        console.log('Sending from %s ...', EMAIL_G);
        console.log('pass : %s', process.env.PASSWORD_G);

        auth = {
            user: EMAIL_G,
            refreshToken: GOOGLE_REFRESH_TOKEN,
            expires: 1484314697598,
            type: 'OAuth2',
            scope: 'https://mail.google.com/',
            accessToken: await oauth2Client.getAccessToken(),

        };

        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                scope: 'https://mail.google.com/',
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: await oauth2Client.getAccessToken(),

            },
        });
    } else if (process.env.NODE_ENV == 'development') {
        console.log('Sending from ethereal Test Account...');
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: testAccount.smtp.secure || false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }
};

/* ******************* SEND Confirmation code ******************** */
exports.send = async (user, title, content) => {
    await init(user);
    // const confirmation_URL = process.env.HOST + "/account/confirmation/" + confirm_code
    // console.log("confirmation_URL ==> %s ", confirmation_URL)
    const mailOptions = {
        from: from,
        to: user.email,
        subject: title,
        html: content ,
        auth: auth,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return new Error('Email not senddddd : ' + error);
        } else {
            console.log('Email sentttt: ' + info.response);
        }
    });
};

/* ************************** SEND RESET PASSWORD LINK  *************** */
exports.resetPass = async (user, res, next, page) => {
    const generator = require('generate-password');
    const password = generator.generate({
        length: 10,
        numbers: true,
    });

    await init(influencer.subscriber);

    const reset_URL =
        process.env.domain +
        '/reset-password/' +
        password +
        '/' +
        influencer._id;
    console.log(
        'confirmation_URL %s ==> %s ',
        influencer.subscriber.first_name,
        reset_URL
    );
    const mailOptions = {
        from: from,
        to: influencer.subscriber.email,
        // to : "khkjhkjkjh@hgj.ih",
        subject: 'Password reset request | ' + process.env.plateform_name,
        html:
            '<pre>' +
            helper.translate(
                'mailer.reset_password.1',
                influencer.subscriber.first_name
            ) +
            '<b>' +
            password +
            '</b>' +
            '\n\n' +
            helper.translate('mailer.reset_password.2') +
            '. \n' +
            reset_URL +
            '\n\n' +
            helper.translate('mailer.reset_password.3') +
            '</pre>',
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Email not send : ' + error);
            res.locals.result =
                "Can't send the reset link to this email, please try again.";
            res.locals.success = false;
            res.render(page);
            return;
        } else {
            console.log('Email sent: M' + info.response);
            next();
        }
    });
};
