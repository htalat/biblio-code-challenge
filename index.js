const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');

const config = require('./config/environment');

// db connection
const dbConfig = require('./config/database');
dbConfig.setup();

// setup passport
const passportConfig = require('./config/passport');
passportConfig.setup();

// load routes
const index = require('./routes/index.js');
const users = require('./routes/users');
const books = require('./routes/books');

// init app
const app = express();

// parse json
app.use(bodyParser.json());
app.use(passport.initialize());

// setup routes
app.get('/', index);
app.use('/users', users);
app.use('/books', books);

// fallback route
app.use((req, res) => res.status(404).send({'status':'fail','data':{url: req.originalUrl + ' not found'}}));

// start server
app.listen(config.PORT);

console.log(`Open http://localhost:${config.PORT} to see a response.`);

module.exports = app;