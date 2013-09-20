/*global trajan,trajangw,expect,listen*/

function connect(serviceId, resourceId, clientId, callback) {
  var server = listen(function(port) {
    var gateway = trajangw();
    gateway.addService(serviceId, 'localhost:' + port);
    var route = gateway.route(serviceId, resourceId, clientId);
    if (callback) callback(route);
  });
  return server;
}

describe('client', function() {
  it('should have an id', function(done) {
    var server = connect('myservice', 'myresource', 'myclient');
    server.on('client', function(client) {
      expect(client.id).to.equal('myclient');
      done();
    });
  });
  it('should receive actions', function(done) {
    var server = connect('s', 'g', 'c', function(route) {
      server.on('client', function(client, resourceId) {
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
      server.on('client', function(client, resourceId) {
        route.disconnect();
        client.on('disconnect', function() {
          done();
        });
      });
    });
  });
  it('should send actions', function(done) {
    var server = connect('s', 'g', 'c', function(route) {
      server.on('client', function(client, resourceId) {
        client.send('myaction');
      });
      route.on('message', function(action) {
        expect(action).to.equal('myaction');
        done();
      });
    });
  });
});