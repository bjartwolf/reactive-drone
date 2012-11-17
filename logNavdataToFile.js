var arDrone = require('ar-drone');
var gzip = require('zlib').createGzip();
var bacon = require('baconjs').Bacon;
var Stream = require('stream');
var fs = require('fs');

var drone = arDrone.createClient();

// Lager en strøm av eventer fra navdata
var eventStream = bacon.fromEventTarget(drone, 'navdata'); 

// Lager en strøm for å skrive ut JSON-data og ny linje for
// hvert navdata-event fra dronen
var jsonStream = new Stream();
jsonStream.readable = true;
eventStream.onValue(function(x) {
    jsonStream.emit('data', JSON.stringify(x) + "\n");
});

// Kobler alle strømmene sammen 
jsonStream.pipe(gzip).pipe(fs.createWriteStream('logdata2.gz'));

// Resten er bare for å kunne stoppe loggingen
// Den tar en liten pause for å være sikker på at filen er lukket skikkelig
// Det kan helt sikkert løses smartere
console.log('Press enter to stop logging');
// For å kunne lese fra stdin, som er pauset i node som default 
process.stdin.resume();
process.stdin.on('data', function () {
    jsonStream.emit('end');
    setTimeout(function() {
        process.exit(1);}
    ,1000)
});
