var arDrone = require('ar-drone');
var bacon = require('./Bacon.js').Bacon;
var client  = arDrone.createClient();
var eventStream = bacon.fromEventTarget(client, 'navdata'); 
var filteredStream = evenStream.filter(
eventStream.onValue(function(x) {console.log(x);});
