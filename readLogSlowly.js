var linestream = require('linestream');
var Stream = require('stream');
var bacon = require('baconjs').Bacon;
var gzip = require('zlib');
var fs = require('fs');
// Her lager vi en stream som bremser hver gang den får data
// og venter litt med å si at den er klar igjen
// Jeg ser på det som et skikkelig trangt rør
var slowStream = new Stream();
slowStream.writable = true;
slowStream.write = function(val) {
    slowStream.emit('data', val);
    // Hvis en stream returnerer false, vil alle
    // oppstrøms vente til den emitter drain, som jeg gjør etter 10 ms
    setTimeout(function () {
        slowStream.emit('drain');
    } , 10);
    return false; 
};

// Det sendes et end-event på slutten av en strøm, det må håndteres
// Det er flere ting som bør håndteres, slik som at den selv bør håndtere
// at oppstrøms-strømmer ikke har data, men det hopper jeg over for at det blir klarere
slowStream.end = function(val) { slowStream.emit('end'); };

var inp = fs.createReadStream('logdata.txt');
linestream.create(inp).pipe(slowStream);

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
