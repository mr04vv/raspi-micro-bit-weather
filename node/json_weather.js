var http = require('http');
var BBCMicrobit = require('../../node_modules/bbc-microbit/index');
var text = 'Hello there';

var id = '2128295'; //chofu
// var id ='2111149'; //sendai
// var id = '2128295'; //sapporo
// var id = '5128581'; //new york
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
    weather(R)
    console.log(res.weather[0].main);
  });
}).on('error', function(e) {
  console.log(e.message);
});

var PATTERNS = [
  {
    name: 'Clouds',
    value: new Buffer('000609110E', 'hex')
  },
  {
    name: 'Thunderstorm',
    value: new Buffer('060C060C08', 'hex')
  },
  {
    name: 'Snow',
    value: new Buffer('150E040E15', 'hex')
  },
  {
    name: 'Clear',
    value: new Buffer('0E1F1F1F0E', 'hex')
  },
  {
    name: 'Rain',
    value: new Buffer('040E1F040C', 'hex')
  },
];

 // choose a random pattern


// search for a micro:bit, to discover a particular micro:bit use:
//  BBCMicrobit.discoverById(id, callback); or BBCMicrobit.discoverByAddress(id, callback);
function weather(str){
  for(var i=0;i<PATTERNS.length;i++){
    if(str==PATTERNS[i].name){
      var pattern = PATTERNS[i];
    }
  }

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

      console.log('sending pattern: "%s"', pattern.name);
      microbit.writeLedMatrixState(pattern.value, function() {
        console.log('\tpattern sent');

        console.log('disconnecting');
        microbit.disconnect();
      });
    });
  });
}
