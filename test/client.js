/*global trajan,trajangw,expect,listen*/

function connect(serviceId, gameId, clientId, callback) {
  var server = listen(function(port) {
    var gateway = trajangw();
    gateway.addService(serviceId, 'localhost:' + port);
    var route = gateway.route(serviceId, gameId, clientId);
    if (callback) callback(route);
  });
  return server;
}

describe('client', function() {
  it('should have an id', function(done) {
    var server = connect('myservice', 'mygame', 'myclient');
    server.on('connection', function(client, gameId) {
      expect(client.id).to.equal('myclient');
      done();
    });
  });
  it('should receive actions', function(done) {
    var server = connect('s', 'g', 'c', function(route) {
      server.on('connection', function(client, gameId) {
        route.send('myaction');
        client.on('action', function(str) {
          expect(str).to.equal('myaction');
          done();
        });
      });
    });
  });
  it('should receive disconnect', function(done) {
    var server = connect('s', 'g', 'c', function(route) {
      server.on('connection', function(client, gameId) {
        route.disconnect();
        client.on('disconnect', function() {
          done();
        });
      });
    });
  });
});