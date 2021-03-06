'use strict';

var bodyParser = require('body-parser');
var	cookieParser = require('cookie-parser');
var	express = require('express');
var	mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/easychat');

var app = express();

app.use(express.static(__dirname + '/../bower_components'));
app.use(express.static(__dirname + '/../client'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '20mb'
}));

app.use(cookieParser('my-key'));
// Define routes
require('./routes/easychat')(app);
require('./routes/account')(app);

module.exports = app;

