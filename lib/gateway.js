var Client = require('./client');
var EventEmitter = require('events').EventEmitter;

var DISCONNECT = 0;
var CONNECT = 1;
var ACTION = 2;

function Gateway(socket, server) {
  this.socket = socket;
  this.server = server;
  this.clients = {};
  this.socket.setEncoding('utf8');
  this.socket.on('data', this.onData.bind(this));
}

Gateway.prototype.__proto__ = EventEmitter.prototype;

Gateway.prototype.send = function(clientId /* , arg1, ..., argN */) {
  var args = Array.prototype.slice.call(arguments);
  var str = JSON.stringify(args);
  this.socket.write(str);
};

Gateway.prototype.onData = function(data) {
  try {
    var msg = JSON.parse(data);
  } catch(e) {
    return console.error(data);
  }
  this.onMessage.apply(this, msg);
};

Gateway.prototype.onMessage = function(type, clientId /* , arg1, ..., argN */) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (type == CONNECT) this.onConnect.apply(this, args);
  else if (type == ACTION) this.onAction.apply(this, args);
  else if (type == DISCONNECT) this.onDisconnect.apply(this, args);
};

Gateway.prototype.onConnect = function(clientId, gameId, userData) {
  if (!clientId || !gameId) return;
  this.clients[clientId] = new Client(this, clientId, gameId, userData);
  this.emit('connection', this.clients[clientId], gameId);
};

Gateway.prototype.onAction = function(clientId) {
  if (!this.clients[clientId]) return;
  var args = Array.prototype.slice.call(arguments, 1);
  this.clients[clientId].onAction.apply(this.clients[clientId], args);
};

Gateway.prototype.onDisconnect = function(clientId) {
  if (!this.clients[clientId]) return;
  this.clients[clientId].onDisconnect();
};

module.exports = Gateway;