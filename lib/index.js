var Server = require('./server');

exports.listen = function(port) {
  var server = new Server(port);
  return server;
};
