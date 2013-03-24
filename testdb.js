var levelup = require('levelup')
var db = levelup('./mydb');
var rs = db.createReadStream({start: "1363993857890"});
rs.on('data', function (x) { console.log(x);});


