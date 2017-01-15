'use strict';

var express = require('express'),
		app = express(),
		secret = require('secret_keys'),
		Yelp = require('yelp');

var yelp = new Yelp({
	consumer_key: secret.key('c_k'),
	consumer_secret: secret.key('c_s'),
	token: secret.key('token'),
	token_secret: secret.key('token_s')
});

console.log('done');