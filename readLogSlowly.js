var linestream = require('linestream');
var SlowStream = require('./slowStream.js');
var bacon = require('baconjs').Bacon;
var unzip = require('zlib').createGunzip();
var fs = require('fs');

var unzippedStream = fs.createReadStream('logdata.txt.gz').pipe(unzip);
var slowStream = new SlowStream(10);
linestream.create(unzippedStream).pipe(slowStream);

// Lager en eventstrøm av den treige strømmen 
var navDataStream = bacon.fromEventTarget(slowStream, 'data');

// Strømmen må parses fra JSON daten i filen
// Det finnes biblioteker for å gjøre dette som en strøm, men de respekterer
// ikke backpressure riktig
var parsedStream = navDataStream.map( function (val) {
    return JSON.parse(val);
});

// Tar en strøm av navdata og returnerer kun data der dronen er i flymodus og 
// høyden er over 1 cm
var flyingStream = parsedStream.filter(function (navdata) {
    return navdata.droneState.flying === 1 && navdata.demo.altitudeMeters > 0.01;
});

// Tar inn navdata og returner et objekt med høyde og retning
var heightAndAltitudeStream = flyingStream.map(function (navdata) {
    return { height: navdata.demo.altitudeMeters,
             direction: navdata.demo.clockwiseDegrees }; 
});

heightAndAltitudeStream.onValue( function (x) { console.log(x); });
