var http = require('https');
var BBCMicrobit = require('../../node_modules/bbc-microbit/index');

var URL = 'https://api.darksky.net/forecast/4eb0193101f78ec1a10d7e873afabfa5/35.3922,139.3226?exclude=alerts,flags,hourly,minutely'
var R='';


http.get(URL, function(res) {
  var body = '';
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    body += chunk;
  });
  res.on('data', function(chunk) {
    res = JSON.parse(body);
    R = ((res.daily.data[0].temperatureMax-32)/1.8).toFixed(1);
    R = R.toString();
    temp_max(R)
  });
}).on('error', function(e) {
  console.log(e.message);
});

function temp_max(){

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
