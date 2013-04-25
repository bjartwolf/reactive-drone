var stream = require('stream');
// Her lager vi en stream som bremser hver gang den får data
// og venter litt med å si at den er klar igjen
// Jeg ser på det som et skikkelig trangt rør

SlowStream.prototype = Object.create(stream.Transform.prototype, {
  constructor: { value: SlowStream }
});

function SlowStream(options) {
  //stream.Transform.call(this, options);
  stream.Transform.call(this, {objectMode : true});
}

SlowStream.prototype._transform = function(chunk, encoding, done) {
  var self = this;
  setTimeout(function() { 
    self.push(chunk);
    done();
  } ,20)
};

module.exports = SlowStream;

