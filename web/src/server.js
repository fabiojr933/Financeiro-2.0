const express = require('express');
const app = express();
const flash = require('express-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./route');
const logger = require('./logger/logger');
const dotenv = require('dotenv');
const authenticate = require('./middlewares/authenticate');

dotenv.config();
const port = process.env.PORT;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '100mb', extended: false}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 3000000}
}));
app.use(flash());

app.get('/', authenticate, (req, res) => {  
    res.render('index');
});
app.use('/', routes);

app.listen(port, (req, res) => {
    logger.info('Servidor inicializado');
})