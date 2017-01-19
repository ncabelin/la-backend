'use strict';

var express = require('express'),
		app = express(),
		secret = require('./secret_keys'),
		path = require('path'),
		request = require('request'),
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
	var fTemp = '';
	request('http://api.openweathermap.org/data/2.5/weather?q=Los Angeles,CA&appid=f6528aa612e42b74b4f7bcf00cd1b0b1', function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var data = JSON.parse(body);
			var temp = (1.8 * (data.main.temp - 273)) + 32; // convert Kelvin to Fahrenheit
      fTemp = '<span><h3><strong>' + Math.round(temp) + '&deg;</strong> f</h3> right now (by <a href="http://openweathermap.org">OpenWeather)</a></span>';
      res.render('index.ejs', { fTemp: fTemp });
		} else {
			res.status(400).send('Error getting weather');
		}
	});
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

app.get('/weather')

app.listen(process.env.PORT || 8080, function() {
	console.log('started server...');
})