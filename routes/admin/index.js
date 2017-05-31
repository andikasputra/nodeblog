var express = require('express');
var app = express();

var categories = require('./categories');
var posts = require('./posts');

app.use('/categories', categories);
app.use('/posts', posts);

module.exports = app;