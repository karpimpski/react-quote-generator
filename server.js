var express = require('express');
var app = express();
var request = require('request');

app.use(express.static('./client/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/public/index.html');
});

app.get('/photo', function(req, res){
  request('http://www.splashbase.co/api/v1/images/random', function(err, response, body){
    if(err) throw err;
    var obj = {'photo': JSON.parse(body).url}
    res.end(JSON.stringify(obj));
  });
});

app.get('/quote', function(req, res){
  var number = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  request('http://api.forismatic.com/api/1.0/?method=getQuote&key='+number+'&format=json&lang=en', function(err, response, body){
    if(err) throw err;
    body = body.replace(/\\/g, "");
    body = JSON.parse(body);
    
    res.end(JSON.stringify(body));
  });
});

app.listen(process.env.PORT || 3000);
