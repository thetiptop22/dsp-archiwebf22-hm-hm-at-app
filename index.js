require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const passport = require('passport');

const FacebookStrategy = require("passport-facebook").Strategy

console.log(`node-redis version is ${require('redis/package.json').version}`);

const app = express();
const bodyParser = require('body-parser');



app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
  
  passport.use( new FacebookStrategy(
    {
      clientID: "638165178124178", //236492138851534
      clientSecret: "e718d8470729c418eeab4d29ae204d9d",// b3cacc60a401b2e86834aa3742e3f794
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
      passReqToCallback : true,
    }, function(req, accessToken, refreshToken, profile, done) {
        console.log(profile);
        return done(null, profile);
    }
  ));

/*
app.use(session({
    secret: 'secret',
    resave: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 365 * 1000
    }
  }))
*/
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

app.set('trust proxy', 1); // trust first proxy
app.use(cookieParser());
app.use(
    cookieSession({
        name: 'session',
        keys: ['key1', 'key2'],
    })
);

const cors = require('cors');
const port = process.env.PORT;
const volleyball = require('volleyball');
const validator = require('./middleware/validator');
const userRouter = require('./routers/userRouter');
const clientRouter = require('./routers/clientRoute');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', require('./routers/awardRoute'));
app.use('/api', clientRouter);
app.use('/api', require('./routers/utils'));
app.use('/api', require('./routers/giftRouter'));
 
const mongo_uri =
    process.env.NODE_ENV == 'production'
        ? 'mongodb://mongo:27017/mongobb' 
        : 'mongodb://localhost:27017/mongobb';

mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('strictQuery', false);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'connection success:'));

app.use(express.static('public'));

// use hbs as view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// add partials to hbs
const hbs = require('hbs');
const { env } = require('process');
hbs.registerPartials(__dirname + '/views');

//
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cors());
app.use(volleyball);

app.use('/api', validator.validateUser, userRouter);
app.use('/api', require('./routers/adminRoute'));

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

app.get('/', function (req, res) {
    require('./controllers/auth/google');

    res.render('index');
});
app.get('/h', function (req, res) {
    require('./controllers/auth/google');

    res.render('index_h');
});
app.get('/facebook', function (req, res) {
    require('./controllers/auth/facebook');

    res.render('index_h');
});
app.get('/login_h', function (req, res) {
    res.render('login_h');
});

app.get('/contacte', function (req, res) {
    res.render('contacte');
});
app.get('/dashboard', function (req, res) {
    res.render('dashboard');
});
app.get('/dashboardx', function (req, res) {
    res.render('dashboardx');
});
app.get('/sidebar', function (req, res) {
    res.render('sidebar');
});
app.get('/historiqueGain', function (req, res) {
    res.render('historiqueGain');
});

app.get('/conditiongeneral', function (req, res) {
    res.render('conditiongeneral');
});

app.get('/registre', function (req, res) {
    res.render('registre');
});

app.get('/mentionlegale', function (req, res) {
    res.render('mentionlegale');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/pageDaccueil', function (req, res) {
    res.render('pageDaccueil');
});

app.get('/tableauBordInteractif', function (req, res) {
    res.render('tableauBordInteractif');
});

app.get('/historiqueGains', function (req, res) {
    res.render('historiqueGains');
});

app.get('/conditionutilisation', function (req, res) {
    res.render('conditionutilisation');
});

app.get('/modalitesParticipation', function (req, res) {
    res.render('modalitesParticipation');
});

app.get('/politiquecookiesutilisation', function (req, res) {
    res.render('politiquecookiesutilisation');
});
app.get('/quiSommeNous', function (req, res) {
    res.render('quiSommeNous');
});
app.get('/test', function (req, res) {


    res.render('test');
});
app.get('/login_test', function (req, res) {


    res.render('login_test');
});
app.get('/inscription', function (req, res) {


    res.render('inscription');
});
app.get('/contacte_test', function (req, res) {


    res.render('contacte_test');
});
app.get('/sideebar', function (req, res) {


    res.render('sideebar');
});
app.get('/cookies', function (req, res) {


    res.render('cookies');
});

app.use('/auth', require('./routers/authRouter'));
app.use('/', require('./routers/pagesHtml'));

app.listen(port, () => {
    console.log(
        `App listening on port ${port}!\nMODE : ${process.env.NODE_ENV}`
    );
});
