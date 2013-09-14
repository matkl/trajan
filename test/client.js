/*global trajan,trajangw,expect,listen*/

describe('client', function() {
  it('should receive actions', function(done) {
    var server = listen(function(port) {
      var gateway = trajangw();
      gateway.addService('test', 'localhost:' + port);
      var route = gateway.route('test', 'test', 'test');
      server.on('connection', function(client, gameId) {
        route.send('myaction');
        client.on('action', function(str) {
          expect(str).to.equal('myaction');
          done();
        });
      });
    });
  });
  it('should receive disconnect');
});