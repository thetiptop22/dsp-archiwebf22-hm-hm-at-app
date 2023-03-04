require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;
const volleyball = require('volleyball');
const validator = require('./middleware/validator');
const userRouter = require('./routers/userRouter');

mongoose.connect('mongodb://localhost:27017/mongobb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('strictQuery', false)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'connection success:'));

app.use(express.static('public'));

// use hbs as view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');



app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(volleyball);

app.use('/api/v1/users', validator.validateUser, userRouter);
 
 app.get("/", function (req, res) {
  res.render("index");
});



app.listen(port, () => {
    console.log(`App listening on port ${port}!\nMODE : ${process.env.NODE_ENV}`)
});