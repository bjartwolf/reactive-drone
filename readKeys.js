var levelup = require('levelup')
var db = levelup('./mydb');
db.createKeyStream().pipe(process.stdout);

