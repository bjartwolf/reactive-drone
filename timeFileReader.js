// This thing reads a file line by line at a slow pace
// and streams it out
// The idea is that this stream can be used instead of the drone
// when testing out new stuff
var fs = require('fs');
var Stream = require('stream');
var linestream = require('linestream').create('output.txt');
var zlib = require('zlib');
var gzip = zlib.createGzip();

// creating a slow linestream
var timeInMsBetweenReadingLines = 10;
var slowStream = new Stream();
slowStream.writable = true;
slowStream.write = function(val) {
    slowStream.emit('data', val);
    setTimeout(function () {
        slowStream.emit('drain');
    } , timeInMsBetweenReadingLines);
    return false; 
};
slowStream.end = function(val) { slowStream.emit('end');console.log('end of stream');};

//connecting pipes
linestream.pipe(slowStream);

//slowStream.pipe(process.stdout);

