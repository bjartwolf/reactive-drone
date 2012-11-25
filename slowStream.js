var Stream = require('stream');
// Her lager vi en stream som bremser hver gang den får data
// og venter litt med å si at den er klar igjen
// Jeg ser på det som et skikkelig trangt rør
var SlowStream = function (delayInMs) {
    var slowStream = new Stream();
    slowStream.writable = true;
    slowStream.write = function(val) {
        slowStream.emit('data', val);
        // Hvis en stream returnerer false, vil alle
        // oppstrøms vente til den emitter drain, som jeg gjør etter 10 ms
        setTimeout(function () {
            slowStream.emit('drain');
        } , delayInMs);
        return false; 
    };
    slowStream.end = function(val) { slowStream.emit('end'); };
    return slowStream;
}
// Det sendes et end-event på slutten av en strøm, det må håndteres
// Det er flere ting som bør håndteres, slik som at den selv bør håndtere
// at oppstrøms-strømmer ikke har data, men det hopper jeg over for at det blir klarere
module.exports = SlowStream;
