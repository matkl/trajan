var net = require('net');
var debug = require('debug')('trajan:server');
var EventEmitter = require('events').EventEmitter;
var Gateway = require('./gateway');

function Server() {
  if (!(this instanceof Server)) return new Server();
  this.server = net.createServer();
  this.server.on('connection', this.onConnection.bind(this));
}

Server.prototype.__proto__ = EventEmitter.prototype;

Server.prototype.listen = function(port, callback) {
  this.server.listen(port, callback);
};

/** Called when a gateway connects. */
Server.prototype.onConnection = function(socket) {
  debug('Gateway connected from ' + socket.remoteAddress);
  var gateway = new Gateway(socket, this);
  gateway.on('client', this.onClient.bind(this));
};

/** Called when a new client connects through a gateway. */
Server.prototype.onClient = function(client) {
  debug('Client ' + client.id + ' connected');
  this.emit('client', client);
};

module.exports = Server;