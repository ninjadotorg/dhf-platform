'use strict';
module.exports = function(Exchange) {
  Exchange.observe('after save', function(ctx, next) {
    next();
  });
  Exchange.afterRemote('create', function(context, user, next) {
    next();
  });
  const exchanges = ['binance'];
  Exchange.listExchange = function(callback) {
    callback(null, exchanges);
  };
  Exchange.remoteMethod('listExchange', {
    description: 'Get all exchange',
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/list', verb: 'get'},
  });
};
