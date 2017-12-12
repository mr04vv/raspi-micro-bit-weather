var http = require('http');
var BBCMicrobit = require('../../node_modules/bbc-microbit/index');
var text = 'Hello there';

var id = '1864518'; //chofu
// var id ='2111149'; //sendai
// var id = '2128295'; //sapporo
// var id = '5128581'; //new york
var appid = 'b6fa337cd031a676c7949c63525dd096';

var URL = 'http://api.openweathermap.org/data/2.5/weather?id='+ id +'&appid='+ appid;

var R='';


http.get(URL, function(res) {
  var body = '';
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    body += chunk;
  });
  res.on('data', function(chunk) {
    res = JSON.parse(body);
    R = (res.main.temp_min-273.15).toFixed(1);
    // R = '2.2';
    R = R.toString();
    temp_min(R)
    // console.log(res.weather[0].main);

  });
}).on('error', function(e) {
  console.log(e.message);
});

function temp_min(){

  console.log('Scanning for microbit');
  BBCMicrobit.discover(function(microbit) {
    console.log('\tdiscovered microbit: id = %s, address = %s', microbit.id, microbit.address);

    microbit.on('disconnect', function() {
      console.log('\tmicrobit disconnected!');
      process.exit(0);
    });

    console.log('connecting to microbit');
    microbit.connectAndSetUp(function() {
      console.log('\tconnected to microbit');

      console.log('sending pattern: "%s"', R);
      microbit.writeLedText(R, function() {
        console.log('\tpattern sent');

        console.log('disconnecting');
        microbit.disconnect();
      });
    });
  });
}
