// This thing reads a file line by line at a slow pace
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

// Creating a writeable filepipe and a zip-pipe
var fileOut = fs.createWriteStream('slettmeg.txt');
var zipOut = fs.createWriteStream('slettmeg.txt.gz');

//connecting pipes
linestream.pipe(slowStream);
slowStream.pipe(process.stdout);
slowStream.pipe(fileOut);
slowStream.pipe(gzip).pipe(zipOut);
