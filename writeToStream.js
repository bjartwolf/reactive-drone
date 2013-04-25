var rx = require('rx');
exports.serializeAndWriteToStream  = function (stream) {
   this.subscribe(function (data) {
        stream.write(JSON.stringify(data));
   });
   return this;
}

exports.writeToStream  = function (stream, serialize) {
   this.subscribe(function (data) {
        stream.write(data);
   });
   return this;
}
