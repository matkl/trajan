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

  describe('connection', function() {
    it('should register a new client', function(done) {
      var server = listen(function(port) {
        var gateway = trajangw();
        gateway.addService('myservice', 'localhost:' + port);
        var route = gateway.route('myservice', 'mygame', 'myclient');
        server.on('connection', function(client, gameId) {
          expect(Object.keys(server.clients)).to.have.length(1);
          expect(server.clientsCount).to.be(1);
          expect(client).to.be.an('object');
          expect(gameId).to.be('mygame');
          done();
        });
      });
    });
  });
});