var EventEmitter = require('events').EventEmitter;

function Client(gateway, id, gameId, user) {
  this.gateway = gateway;
  this.id = id;
  this.user = user;
}

Client.prototype.__proto__ = EventEmitter.prototype;

Client.prototype.onAction = function() {
  var args = Array.prototype.unshift.call(arguments, 'action');
  this.emit.apply(this, args);
};

Client.prototype.onDisconnect = function() {
  this.emit('disconnect');
};

module.exports = Client;