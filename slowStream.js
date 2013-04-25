var stream = require('stream');
// Her lager vi en stream som bremser hver gang den får data
// og venter litt med å si at den er klar igjen
// Jeg ser på det som et skikkelig trangt rør

SlowStream.prototype = Object.create(stream.Transform.prototype, {
  constructor: { value: SlowStream }
});

function SlowStream(delay) {
  this.delay = delay || 20;
  stream.Transform.call(this, {objectMode: true}); 
}

SlowStream.prototype._transform = function(chunk, encoding, done) {
  // Does not transform, just push the chunck out again
  this.push(chunk);
  // Waits with emitting done to slow stream down
  setTimeout(function() { 
    done();
  } , this.delay)
};

module.exports = SlowStream;

