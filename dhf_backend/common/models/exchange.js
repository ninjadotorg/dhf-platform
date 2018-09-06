'use strict';

const {EXCHANGE} = require('../lib/constants');
module.exports = function(Exchange) {
  Exchange.observe('after save', function(ctx, next) {
    next();
  });
  Exchange.afterRemote('create', function(context, user, next) {
    next();
  });

  Exchange.listExchange = function(callback) {
    callback(null, EXCHANGE);
  };
  Exchange.remoteMethod('listExchange', {
    description: 'Get all exchange',
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/list', verb: 'get'},
  });
};
