var levelup = require('levelup')
var db = levelup('./mydb', {valueEncoding: "json"})

var events = require('events');
// Utility function to make streams observable
events.EventEmitter.prototype.toObservable = require('./toObservable.js');

var rx = require('rx');
// Utility function to pipe observables to streams 
rx.Observable.prototype.serializeAndWriteToStream = require('./writeToStream.js').serializeAndWriteToStream;  
rx.Observable.prototype.writeToStream = require('./writeToStream.js').writeToStream;  

var arDrone = require('ar-drone');

var client = arDrone.createClient();
client.toObservable('navdata').
    select(function (navdata) {
        var timestamp = Date.now();
        return {key: timestamp, value: navdata};
    }).
    writeToStream(db.createWriteStream()).
    serializeAndWriteToStream(process.stdout);
