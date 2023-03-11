require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');

const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');
const port = process.env.PORT ;
const volleyball = require('volleyball');
const validator = require('./middleware/validator');
const userRouter = require('./routers/userRouter');
const clientRouter = require('./routers/clientRoute');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/api', clientRouter);
app.use('/api', require('./routers/utils'));

mongoose.connect('mongodb://localhost:27017/mongobb', {
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

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));


app.get('/', function (req, res) {
    require('./controllers/auth/google');

    res.render('index');
});

function isConnected(req, res, next) {
    req.session.client ? next() : res.sendStatus(401);
}

app.get('/dashboard', isConnected,function (req, res) {

    // send client data to dashboard
    res.locals.client = req.session.client;
    res.locals.test = 111;

    res.render('dashboard');
});

app.get('/login_h', function (req, res) {


    res.render('login_h');
});

app.get('/contacte', function (req, res) {


    res.render('contacte');
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

app.get('/statistiques', function (req, res) {


    res.render('statistiques');
});


app.get('/pageDaccueil', function (req, res) {


    res.render('pageDaccueil');
});

app.get('/tableauBordInteractif', function (req, res) {


    res.render('tableauBordInteractif');
});

app.use("/auth", require('./routers/authRouter'));

app.listen(port, () => {
    console.log(
        `App listening on port ${port}!\nMODE : ${process.env.NODE_ENV}`
    );
});
