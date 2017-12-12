var http = require('http');
var BBCMicrobit = require('../node_modules/bbc-microbit/index');
var text = 'Hello there';

var id = '1864518';
var appid = 'b6fa337cd031a676c7949c63525dd096';

var URL = 'http://api.openweathermap.org/data/2.5/weather?id='+ id +'&appid='+ appid;

var R="";


http.get(URL, function(res) {
  var body = '';
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    body += chunk;
  });
  res.on('data', function(chunk) {
    res = JSON.parse(body);
    R = res.weather[0].main;
   
    console.log(res.weather[0].main);
  });
}).on('error', function(e) {
  console.log(e.message);
});
