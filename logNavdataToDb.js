var levelup = require('levelup')
var db = levelup('./mydb', {valueEncoding: "json"})

var events = require('events');
// Utility function to make streams observable
events.EventEmitter.prototype.toObservable = require('./toObservable.js');

var rx = require('rx');
// Utility function to pipe observables to streams 
rx.Observable.prototype.writeToStream = require('./writeToStream.js');  

var arDrone = require('ar-drone');

var client = arDrone.createClient();
client.toObservable('navdata').
    select(function (val) {
        var stamp = Date.now();
        return {key: stamp, value: val};
    }).
    writeToStream(db.createWriteStream()).
    writeToStream(process.stdout, serialize = true);
