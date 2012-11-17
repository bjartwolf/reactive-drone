var Stream = require('stream');
var bacon = require('baconjs').Bacon;
var json = require('stream-serializer').json;

// Lager en strøm av linjer ved å lese filen output.txt linje for linje
var linestream = require('linestream').create('output.txt');

// Her lager vi en stream som bremser hver gang den får data
// og venter litt med å si at den er klar igjen
// Jeg ser på det som et skikkelig trangt rør
var slowStream = new Stream();
slowStream.writable = true;
slowStream.write = function(val) {
    var speedOfSlowPipeInMs = 10;
    slowStream.emit('data', val);
    setTimeout(function () {
        slowStream.emit('drain');
    } , speedOfSlowPipeInMs);
    // Hvis en stream returnerer false, vil alle
    // oppstrøms vente til den emitter drain, som jeg gjør etter 10 ms
    return false; 
};

// Det sendes et end-event på slutten av en strøm
// Det må håndteres ellers kræsjer pipe'n
slowStream.end = function(val) { slowStream.emit('end'); };

/// Pipe strømmen av linjer inn i den treige strømmen
linestream.pipe(slowStream);

// Nå har vi en treig strøm av linjer som kommer inn

// Lager en eventstrøm av den treige strømmen 
var navDataStream = bacon.fromEventTarget(slowStream, 'data');

// Strømmen må parses fra JSON daten i filen
var parsedStream = navDataStream.map( function (val) {
    return JSON.parse(val);
});

// Tar en strøm av navdata og returnerer kun data der dronen er i flymodus og 
// høyden er over 1 cm
var flyingStream = parsedStream.filter(function (navdata) {
    return navdata.droneState.flying === 1 && navdata.demo.altitudeMeters > 0.01;
});

// Tar inn navdata og returner et objekt med høyde og retning
var altitudeStream = flyingStream.map(function (navdata) {
    return { height: navdata.demo.altitudeMeters,
             direction: navdata.demo.clockwiseDegrees }; 
});

// Litt seremoni for å koble tilbake eventstrømmen til en vanlig strøm
// Dette er litt juks, for den vil ikke respektere stream-interfacet full ut 
// men det funker for oss nå
var consoleStream = new Stream;
consoleStream.writeable = true;
consoleStream.write = function (val) {
    consoleStream.emit('data', val);
}

altitudeStream.onValue( function (x) {
    consoleStream.emit('data', x);
});

// Pipe strømmen av data fra consoleStrømmen igjennom en json-serializer og ut til konsollet 
json(consoleStream).pipe(process.stdout);
