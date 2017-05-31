var express = require('express');
var app = express();

var categories = require('./categories');

app.use('/categories', categories);

module.exports = app;