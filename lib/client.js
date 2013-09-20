var EventEmitter = require('events').EventEmitter;

function Client(gateway, id, resourceId, data) {
  this.gateway = gateway;
  this.id = id;
  this.resourceId = resourceId;
  this.data = data;
}

Client.prototype.__proto__ = EventEmitter.prototype;

Client.prototype.send = function() {
  Array.prototype.unshift.call(arguments, this.id);
  this.gateway.send.apply(this.gateway, arguments);
};

Client.prototype.onAction = function() {
  Array.prototype.unshift.call(arguments, 'action');
  this.emit.apply(this, arguments);
};

Client.prototype.onDisconnect = function() {
  this.emit('disconnect');
};

module.exports = Client;