var net = require('net');
var EventEmitter = require('events').EventEmitter;
var Gateway = require('./gateway');

function Server() {
  if (!(this instanceof Server)) return new Server();
  this.clients = {};
  this.clientsCount = 0;
  this.server = net.createServer();
  this.server.on('connection', this.onGateway.bind(this));
}

Server.prototype.__proto__ = EventEmitter.prototype;

Server.prototype.listen = function(port, callback) {
  this.server.listen(port, callback);
};

Server.prototype.onGateway = function(socket) {
  var gateway = new Gateway(socket, this);
  gateway.on('connection', this.onConnection.bind(this));
};

Server.prototype.onConnection = function(client, gameId) {
  this.clients[client.id] = client;
  this.clientsCount += 1;
  this.emit('connection', client, gameId);
};

module.exports = Server;