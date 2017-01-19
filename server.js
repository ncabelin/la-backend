'use strict';

var express = require('express'),
		app = express(),
		secret = require('./secret_keys'),
		path = require('path'),
		Yelp = require('yelp');

var yelp = new Yelp({
	consumer_key: secret('c_k'),
	consumer_secret: secret('c_s'),
	token: secret('token'),
	token_secret: secret('token_s')
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/:searchterm', function(req, res) {
	var searchterm = req.params.searchterm;
	yelp.search({
		term: searchterm,
		location: 'Los Angeles'})
	.then(function(data) {
		res.json(data);
	}).catch(function(err) {
		res.status(400).send(err);
	});
});

app.listen(process.env.PORT || 8080, function() {
	console.log('started server...');
})