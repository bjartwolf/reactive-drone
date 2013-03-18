var linestream = require('linestream');
var SlowStream = require('./slowStream.js');
var events = require('events');
var unzip = require('zlib').createGunzip();
var fs = require('fs');
var rx = require('rx');

events.EventEmitter.prototype.toObservable = function(eventName) {
	var parent = this;
	return rx.Observable.create(function(observer) {
		var handler = function(o) {
			observer.onNext(o);
		};
		parent.addListener(eventName, handler);
		return function() {
			parent.removeListener(eventName, handler);
		};
	});
};

var unzippedStream = fs.createReadStream('logdata.txt.gz').pipe(unzip);
var slowStream = new SlowStream(10);
var slowLines = linestream.create(unzippedStream).pipe(slowStream);

// Lager en eventstrøm av den treige strømmen 

var navDataStream = slowLines.toObservable('data');
// Strømmen må parses fra JSON daten i filen
// Det finnes biblioteker for å gjøre dette som en strøm, men de respekterer
// ikke backpressure riktig
var parsedStream = navDataStream.select( function (val) {
    return JSON.parse(val);
});

// Tar en strøm av navdata og returnerer kun data der dronen er i flymodus og 
// høyden er over 1 cm
var flyingStream = parsedStream.where(function (navdata) {
    return navdata.droneState.flying === 1 && navdata.demo.altitudeMeters > 0.01;
});

// Tar inn navdata og returner et objekt med høyde og retning
var heightAndAltitudeStream = flyingStream.select(function (navdata) {
    return { height: navdata.demo.altitudeMeters,
             direction: navdata.demo.clockwiseDegrees }; 
});

heightAndAltitudeStream.subscribe( function (x) { console.log(x); });
