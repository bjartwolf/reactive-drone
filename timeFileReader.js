// This thing reads a file line by line at a slow pace
var fs = require('fs');
var Stream = require('stream');
var linestream = require('linestream').create('bebFile.txt');
var zlib = require('zlib');
var gzip = zlib.createGzip();

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

// Creating a writeable filepipe 
var fileOut = fs.createWriteStream('output.txt');
var zipOut = fs.createWriteStream('zipout.txt');

//connecting pipes
linestream.pipe(slowStream);
slowStream.pipe(process.stdout);
slowStream.pipe(fileOut);
slowStream.pipe(gzip).pipe(zipOut);
