var levelup = require('levelup')
var db = levelup('./mydb');
var rs = db.createKeyStream();
rs.on('data', function (x) { console.log(x);});


