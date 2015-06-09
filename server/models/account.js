'use strict';

var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	hashedPassword: String
});

AccountSchema.methods = {
	makeHashedPassword: function(password) {
		if (!password) {
			return '';
		}

		return passwordHash.generate(password);
	},
	authenticate: function(password) {
		return passwordHash.verify(password, this.hashedPassword);
	}
};

AccountSchema.virtual('password').set(function(password) {
	this.hashedPassword = this.makeHashedPassword(password);
});

mongoose.model('Account', AccountSchema);
