var zlib = require('zlib');
console.log('Press enter to stop logging');
process.stdin.resume();
var gzip = zlib.createGzip();
var arDrone = require('ar-drone');
var bacon = require('./Bacon.js').Bacon;
var fs = require('fs');
var Stream = require('stream');

var client  = arDrone.createClient();

var s = new Stream();//No paranthesis in stream-handbook.. why?
s.readable = true;
var eventStream = bacon.fromEventTarget(client, 'navdata'); 
var testStream = bacon.sequentially(1000, [10, 11,13,14,15,16,16]); 
//var filteredStream = testStream.filter(function(val) { return val%2===0;});
eventStream.onValue(function(x) {
    s.emit('data', JSON.stringify(x) + "\n");
});

// Creating a writeable filepipe and a zip-pipe
var fileOut = fs.createWriteStream('output3.txt');
var zipOut = fs.createWriteStream('zipout3.txt.gz');

// Connecting pipes
//s.pipe(process.stdout);
s.pipe(fileOut);
s.pipe(gzip).pipe(zipOut);
process.stdin.on('data', function (chunk, key) {console.log('ending');s.emit('end');setTimeout(function() {process.exit(1);},1000)});
