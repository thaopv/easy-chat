'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	},
	expired: {
		type: Number,
		default: Date.now()
	}
});

TokenSchema.methods = {
	isExpired: function() {
		var currentDate = Date.now();
		return currentDate > this.expired;
	},
	setExpire: function() {
		var timeExpired = Date.now() + 86400000; //limit is 24h, unit: milisecond
		this.expired = timeExpired;
	}
};

mongoose.model('Token', TokenSchema);
