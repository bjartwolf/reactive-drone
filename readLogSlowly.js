var levelup = require('levelup')
var db = levelup('./mydb', {valueEncoding: "json"})
var events = require('events');

// Utility function to make streams observable
events.EventEmitter.prototype.toObservable = require('./toObservable.js');

var rx = require('rx');
// Utility function to pipe observables to streams 
rx.Observable.prototype.serializeAndWriteToStream = require('./writeToStream.js').serializeAndWriteToStream;  

// A stream that just emits one event every n-miliseconds
var SlowStream = require('./slowStream.js');
var slowStream = new SlowStream(2);

db.createReadStream().pipe(slowStream).toObservable().
    select(function (keyValue) {
        return JSON.parse(keyValue.value);
    }).
    filter (function (navdata) {
        return navdata.droneState.flying === 1 && navdata.demo.altitudeMeters > 0.01;
    }).
    select(function (val) {
        return {height: val.demo.altitudeMeters, 
                compass: val.demo.clockwiseDegrees };
    }).serializeAndWriteToStream(process.stdout);
