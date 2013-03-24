var levelup = require('levelup')
var repl = require('repl');
var db = levelup('./mydb', {valueEncoding: "json"})

var events = require('events');
// Utility function to make streams observable
events.EventEmitter.prototype.toObservable = require('./toObservable.js');

var fs = require('fs');
var rx = require('rx');
// Utility function to pipe observables to streams 
rx.Observable.prototype.writeToStream = require('./writeToStream.js');  

var linestream = require('linestream');

var unzippedStream = fs.createReadStream('logdata.txt');
var lines = linestream.create(unzippedStream);
var stamp = Date.now();

lines.toObservable().
    select(function (val) {
        stamp +=1;
        return {key: stamp, value: val};
    }).
    writeToStream(db.createWriteStream()).
    writeToStream(process.stdout, serialize = true);
