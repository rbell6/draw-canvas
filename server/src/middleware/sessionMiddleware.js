'use strict';

let sessions = require('client-sessions');

let sessionMiddleware = sessions({
  cookieName: 'session',
  secret: 'j8Dw12QJIO!3xO2pZ!',
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
});

module.exports = sessionMiddleware;