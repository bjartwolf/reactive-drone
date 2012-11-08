// This thing reads a file line by line at a slow pace
var fs = require('fs');
var Stream = require('stream');
var linestream = require('linestream').create('bebFile.txt');

// creating a slow linestream
var timeInMsBetweenReadingLines = 1000;
var slowStream = new Stream();
slowStream.writable = true;
slowStream.write = function(val) {
    slowStream.emit('data', val);
    setTimeout(function () {
        slowStream.emit('drain');
    } , timeInMsBetweenReadingLines);
    return false; 
};
slowStream.end = function(val) { console.log('end of stream');};

//connecting pipes
linestream.pipe(slowStream);
slowStream.pipe(process.stdout);
