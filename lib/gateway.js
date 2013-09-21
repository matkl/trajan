var debug = require('debug')('trajan:gateway');
var EventEmitter = require('events').EventEmitter;
var Client = require('./client');

var DISCONNECT = 0;
var CONNECT = 1;
var ACTION = 2;

function Gateway(socket, server) {
  this.socket = socket;
  this.server = server;
  this.clients = {};
  this.socket.setEncoding('utf8');
  this.socket.on('data', this.onData.bind(this));
  this.socket.on('end', this.onEnd.bind(this));
  this.socket.on('error', this.onError.bind(this));
  this.buffer = '';
  this.payloadLength = null;
}

Gateway.prototype.__proto__ = EventEmitter.prototype;

Gateway.prototype.send = function(clientId /* , arg1, ..., argN */) {
  var args = Array.prototype.slice.call(arguments);
  var payload = JSON.stringify(args);
  var buffer = payload.length + '#' + payload;
  debug('writing ' + buffer);
  this.socket.write(buffer);
};

Gateway.prototype.removeClient = function(client) {
  delete this.clients[client.id];
  client.onDisconnect();
};

Gateway.prototype.onData = function(data) {
  this.buffer += data;
  var n = this.buffer.indexOf('#');
  if (n >= 0) {
    this.payloadLength = parseInt(this.buffer.substring(0, n));
    if (isNaN(this.payloadLength)) return console.error('protocol error');
    this.buffer = this.buffer.substring(n + 1);
  }
  if (this.payloadLength) {
    if (this.buffer.length == this.payloadLength) {
      this.handleData(this.buffer);
    } else if (this.buffer.length > this.payloadLength) {
      var buffer = this.buffer.substring(0, this.payloadLength);
      var rest = this.buffer.substring(this.payloadLength);
      this.handleData(buffer),
      this.onData(rest);
    }
  }
  this.emit('data', data);
};

Gateway.prototype.handleData = function(data) {
  this.payloadLength = null;
  this.buffer = '';
  var msg = JSON.parse(data);
  this.onMessage.apply(this, msg);
};

Gateway.prototype.onMessage = function(type, clientId /* , arg1, ..., argN */) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (type == CONNECT) this.onConnect.apply(this, args);
  else if (type == ACTION) this.onAction.apply(this, args);
  else if (type == DISCONNECT) this.onDisconnect.apply(this, args);
};

/** Called when a client connects through the gateway. */
Gateway.prototype.onConnect = function(clientId, resourceId, clientData) {
  this.clients[clientId] = new Client(this, clientId, resourceId, clientData);
  this.emit('client', this.clients[clientId]);
};

/** Called when a client sends an action. */
Gateway.prototype.onAction = function(clientId) {
  if (!this.clients[clientId]) return;
  var args = Array.prototype.slice.call(arguments, 1);
  this.clients[clientId].onAction.apply(this.clients[clientId], args);
};

/** Called when a client disconnects. */
Gateway.prototype.onDisconnect = function(clientId) {
  if (!this.clients[clientId]) return;
  this.removeClient(this.clients[clientId]);
};

Gateway.prototype.onEnd = function() {
  debug('end');
  this.emit('end');
};

/** Called when a socket error occurs. */
Gateway.prototype.onError = function(err) {
  console.error(err);
};

/** Called when the connection to the gateway is closed. */
Gateway.prototype.onClose = function(hadError) {
  debug('close');
  for (var i in this.clients) {
    this.clients[i].onDisconnect();
  }
  this.emit('close', hadError);
};

module.exports = Gateway;