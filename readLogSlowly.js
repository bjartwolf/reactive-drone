var linestream = require('linestream');
var events = require('events');
var unzip = require('zlib').createGunzip();
var fs = require('fs');
var rx = require('rx');

var slowInterval = rx.Observable.interval(10);

// Utility function to make streams observable
events.EventEmitter.prototype.toObservable = require('./toObservable.js');

var unzippedStream = fs.createReadStream('logdata.txt.gz').pipe(unzip);
var lines = linestream.create(unzippedStream);

var navDataStream = lines.toObservable('data');
var slowLines = navDataStream.zip(slowInterval, function (navdata, interval) {
    return JSON.parse(navdata); // disposes the intervalstream, just workaround for delay
});

// Tar en strøm av navdata og returnerer kun data der dronen er i flymodus og 
// høyden er over 1 cm
var flyingStream = slowLines.where(function (navdata) {
    return navdata.droneState.flying === 1 && navdata.demo.altitudeMeters > 0.01;
});

// Tar inn navdata og returner et objekt med høyde og retning
var heightAndAltitudeStream = flyingStream.select(function (navdata) {
    return { height: navdata.demo.altitudeMeters,
             direction: navdata.demo.clockwiseDegrees }; 
});

heightAndAltitudeStream.subscribe( function (x) { console.log(x); });
