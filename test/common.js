/**
 * Expose `expect`.
 */
global.expect = require('expect.js');

/**
 * Expose `trajan`.
 */
global.trajan = require('..');

/**
 * Expose `trajan-gateway` as `trajangw`.
 */
global.trajangw = require('trajan-gateway');

global.listen = function(callback) {
  var server = trajan();
  server.listen(0, function() {
    callback(server.server.address().port);
  });
  return server;
}
