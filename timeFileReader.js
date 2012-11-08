// This thing reads a file line by line at a slow pace
var fs = require('fs');
//var byline = require('byline');
var linestream = require('linestream');
var stream = linestream.create('bebFile.txt');
//var bebFileByLine = byline.createLineStream(fs.createReadStream('bebFile.txt'));
var Stream = require('stream');
var s = new Stream();
s.writable = true;
s.write = function(val) {console.log(val);setTimeout(function () {s.emit('drain');},1000);return false;};
s.end = function(val) {console.log('end: ' + val);};
//bebFileByLine.pipe(process.stdout);
stream.pipe(s);
//s.pipe(process.stdout);
