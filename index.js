require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');

const app = express();
const cors = require('cors');
const port = process.env.PORT ;
const volleyball = require('volleyball');
const validator = require('./middleware/validator');
const userRouter = require('./routers/userRouter');
const clientRouter = require('./routers/clientRoute');

app.use('/api', clientRouter);

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

app.use("/auth", require('./routers/authRouter'));

app.listen(port, () => {
    console.log(
        `App listening on port ${port}!\nMODE : ${process.env.NODE_ENV}`
    );
});
