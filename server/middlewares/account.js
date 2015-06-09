'use strict';

require('../models/account');

var Account = require('mongoose').model('Account');
var bird = require('bluebird');
var self = module.exports;

function findByEmail(email) {
	if (!email) {
		return;
	}
	var query = Account.findOne({
		email: email
	});

	var queryexec = bird.promisify(query.exec, query);
	return queryexec().then(function findByEmailDone(account) {
		return account;
	});
}

function authenticate(account, inputPassword) {
	if (!account) {
		return false;
	}

	return account.authenticate(inputPassword);
}

function createAccount(req) {
	if (!req) {
		return;
	}
	var newAccount = new Account({
		email: req.body.email,
		password: req.body.password
	});

	var queryexec = bird.promisify(newAccount.save, newAccount);

	return queryexec().then(function createAccountDone() {
		return newAccount;
	});
}

function forgotPassword(account) {
	if (!account) {
		return;
	}

	// todo: generate pwd
	account.password = 'changed';

	var queryexec = bird.promisify(account.save, account);

	return queryexec().then(function forgotPasswordDone() {
		return account;
	});
}

self.login = function(req, res, next) {
	return findByEmail(req.body.email).then(function findByEmailDone(account) {
		if (!account) {
			return res.status(500).end();
		}

		if (!authenticate(account, req.body.password)) {
			return res.status(500).end();
		}

		req._user = account;
		return next();
	}).catch(function handleError(err) {
		return res.status(401).json(err);
	});
};

self.register = function(req, res, next) {
	return findByEmail(req.body.email).then(function findByEmailDone(account) {
		if (account) {
			return res.status(500).end();
		}

		return createAccount(req).then(function createAccountDone(account) {
			req._user = account;
			return next();
		});
	}).catch(function handleError(err) {
		return res.status(500).json(err);
	});
};

self.forgotPassword = function(req, res, next) {
	return findByEmail(req.body.email).then(function findByEmailDone(account) {
		if (!account) {
			return res.status(500).end();
		}

		return forgotPassword(account).then(function forgotPasswordDone(account) {
			return res.end();
		});
	}).catch(function handleError(err) {
		return res.status(500).json(err);
	});
};
