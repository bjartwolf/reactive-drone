// This thing reads a file line by line at a slow pace
// and streams it out
// The idea is that this stream can be used instead of the drone
// when testing out new stuff
var fs = require('fs');
var Stream = require('stream');
var linestream = require('linestream').create('output.txt');
var zlib = require('zlib');
var gzip = zlib.createGzip();

var bacon = require('baconjs').Bacon;

// creating a slow linestream
var timeInMsBetweenReadingLines = 10;
var slowStream = new Stream();
slowStream.writable = true;
slowStream.write = function(val) {
    slowStream.emit('data', val);
    setTimeout(function () {
        slowStream.emit('drain');
    } , timeInMsBetweenReadingLines);
    // Returning false causes upstreams pipes to pause,
    // as long as they are implemented correctly
    // They will resume when emitting drain
    return false; 
};
slowStream.end = function(val) { slowStream.emit('end');console.log('end of stream');};

//connecting pipes
linestream.pipe(slowStream);

//slowStream.pipe(process.stdout);

var baconStream = bacon.fromEventTarget(slowStream, 'data');
var parsedStream = baconStream.map( function (val) {
    return JSON.parse(val);
});
var flyingStream = parsedStream.filter(function (val) {
    return val.droneState.flying === 1;
});
flyingStream.onValue( function (x) {
    console.log('stream : ' + x.demo.altitudeMeters);
});
