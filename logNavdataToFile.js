console.log('Press enter to stop logging');
// To read from standard in it is set to resume
process.stdin.resume();
var zlib = require('zlib');
var gzip = zlib.createGzip();
var arDrone = require('ar-drone');
var bacon = require('bacon.js').Bacon;
var fs = require('fs');
var Stream = require('stream');

var client  = arDrone.createClient();

var s = new Stream();//No paranthesis in stream-handbook.. why?
s.readable = true;

var eventStream = bacon.fromEventTarget(client, 'navdata'); 
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

// To end the stream when enter is pressed
// It pauses for a second to make sure streams are closed, the zip-thingy 
// breaks if quit to early. There has to be a better way...
process.stdin.on('data', function () {
    console.log('ending');
    s.emit('end');
    setTimeout(function() {
        process.exit(1);}
    ,1000)
});
