const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const dotenv     = require('dotenv').config()

const routesUser = require('./api/routes/users');

const app = express();

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

app.use('/users', routesUser);

mongoose
  .connect('mongodb://node-user:node-user-password@node-rest-mongodb-shard-00-00-teyic.mongodb.net:27017,node-rest-mongodb-shard-00-01-teyic.mongodb.net:27017,node-rest-mongodb-shard-00-02-teyic.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-mongodb-shard-0&authSource=admin&retryWrites=true', {
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