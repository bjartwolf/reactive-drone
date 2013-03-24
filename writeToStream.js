var rx = require('rx');
module.exports = function (stream, serialize) {
   this.subscribe(function (data) {
        if (serialize) {
            stream.write(JSON.stringify(data));
        } else {
            stream.write(data);
        }
   });
   return this;
}
