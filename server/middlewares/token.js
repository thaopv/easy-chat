'use strict';

require('../models/token');

var Token = require('mongoose').model('Token');
var bird = require('bluebird');
var self = module.exports;

function findTokenBySessionToken(token) {
	var query = Token.findOne({
		userId: token.userId,
		token: token.token
	});

	var queryexec = bird.promisify(query.exec, query);

	return queryexec();
}

function createToken(userId) {
	if (!userId) {
		return bird.reject();
	}

	var newToken = new Token({
		userId: userId,
		token: Date.now()
	});

	newToken.setExpire();

	var queryexec = bird.promisify(newToken.save, newToken);

	return queryexec().then(function createTokenDone() {
		return newToken;
	});
}

self.createToken = function(req, res, next) {
	var user = req._user;
	var token = req.cookies.token;
	console.log('0. Create token: ' + token);
	if (!token) {
		return createToken(user._id).then(function createTokenDone(token) {
			console.log('1. create token done');
			return res.cookie('token', token).end();
		});
	}

	return findTokenBySessionToken(token).then(function findTokenBySessionTokenDone(token) {
		if (!token) {
			return res.status(500).end();
		}

		token.setExpire();
		return res.cookie('token', token).end();
	});
};

self.validateToken = function(req, res, next) {
	var token = req.cookies.token;
	if (!token) {
		return res.status(500).end();
	}

	return findTokenBySessionToken(token).then(function findTokenBySessionTokenDone(token) {
		console.log('2. token: ' + token);
		if (!token || token.isExpired()) {
			return res.status(500).end();
		}

		token.setExpire();
		return res.cookie('token', token).end();
	}).catch(function handleError(err) {
		console.log(err);
		return res.status(500).end();
	});
};
