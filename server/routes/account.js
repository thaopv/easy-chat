'use strict';

var account = require('../middlewares/account');
var token = require('../middlewares/token');

module.exports = function(app) {
	app.route('/api/session')
		.get(token.validateToken)
		.post(account.login, token.createToken);

	app.route('/api/session/register')
		.post(account.register, token.createToken);

	app.route('/api/session/forgotPassword')
		.post(account.forgotPassword);
};
