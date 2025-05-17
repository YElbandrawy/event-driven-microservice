const express = require('express');
const morgan = require('morgan');
const logRoutes = require('./routes/logRoutes');

const app = express();
app.use(morgan('dev'));

app.use('/api/v1/logs', logRoutes);

app.all('*', (req, res, next) => {
  res.status(404).json({
    message: 'this Rout dosen NOT exist',
  });
});

module.exports = app;
