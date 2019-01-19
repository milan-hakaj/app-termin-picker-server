require('dotenv').config()
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const morgan     = require('morgan');

const routesUser = require('./api/routes/users');
const routesLocation = require('./api/routes/locations');
const routesCountry = require('./api/routes/countries');
const routesCities = require('./api/routes/cities');

const app = express();

app.get('/', (req, res) => res.send('Hello World!'))

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
  }
  next();
});

app.use('/locations', routesLocation);
app.use('/users', routesUser);
app.use('/countries', routesCountry);
app.use('/cities', routesCities);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  }).then(() => console.log('mongoose ok'))
    .catch(() => console.log('mongoose error'));

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;