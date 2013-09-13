var net = require('net');

function Server(port) {
  this.port = port;
  this.server = net.createServer();
  this.listen();
  this.setup();
}

Server.prototype.listen = function() {
  this.server.listen(this.port);
};

Server.prototype.setup = function() {
  this.server.on('connection', this.onconnection.bind(this));
};

Server.prototype.onconnection = function(socket) {
  console.log('connect');
};

module.exports = Server;
