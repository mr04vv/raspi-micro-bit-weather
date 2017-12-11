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
    k()
    console.log(res.weather[0].main);
  });
}).on('error', function(e) {
  console.log(e.message);
});


function k(){
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

      console.log('sending text: "%s"', R);
      microbit.writeLedText(R, function() {
        console.log('\ttext sent');

        console.log('disconnecting');
        microbit.disconnect();
      });
    });
  });
}
