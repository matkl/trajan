/*global trajan,trajangw,expect,listen*/

var net = require('net');

describe('server', function() {
  describe('listen', function() {
    it('should accept connections', function(done) {
      var server = listen(function(port) {
        net.connect(port, function() {
          done();
        });
      });
    });
  });
});