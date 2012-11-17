// This thing reads a file line by line at a slow pace
// and streams it out
// The idea is that this stream can be used instead of the drone
// when testing out new stuff
var fs = require('fs');
var Stream = require('stream');
var bacon = require('baconjs').Bacon;
var speedOfSlowPipeInMs = 10;

// Her lager vi en pipe som bremser hver gang den får data
// og venter litt med å si at den er klar igjen
var slowStream = new Stream();
slowStream.writable = true;
slowStream.write = function(val) {
    // Send data ut av en pipe ved å sende et data-event
    slowStream.emit('data', val);
    setTimeout(function () {
        slowStream.emit('drain');
    } , speedOfSlowPipeInMs);
    // Hvis en stream returnerer false, vil alle
    // oppstrøms vente til den emitter drain
    return false; 
};

// Litt seremoni for å koble tilbake
// Dette er litt juks, for den vil ikke respektere alle ting
// en stream kan, men det funker for oss nå
var consoleStream = new Stream;
consoleStream.writeable = true;
consoleStream.write = function (val) {
    consoleStream.emit('data', val);
}

// Det sendes et end-event på slutten av en strøm
// Det må håndteres ellers kræsjer pipe'n
slowStream.end = function(val) { slowStream.emit('end');console.log('end of stream');};

// Koble ledninger sammen, hvem skal snakke med hvem
// Lager en strøm av linjer ved å lese filen output.txt linje for linje
var linestream = require('linestream').create('output.txt');
// Kobler linjestrømmen inn i en treg strøm 
linestream.pipe(slowStream);

// Lager en eventstrøm
var baconStream = bacon.fromEventTarget(slowStream, 'data');

var parsedStream = baconStream.map( function (val) {
    return JSON.parse(val);
});
var flyingStream = parsedStream.filter(function (val) {
    return val.droneState.flying === 1;
});
var altitudeStream = flyingStream.map(function (val) {
    return val.demo.altitudeMeters; 
});

altitudeStream.onValue( function (x) {
      consoleStream.emit('data', JSON.stringify(x) + '\n');
});

consoleStream.pipe(process.stdout);
