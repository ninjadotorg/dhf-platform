'use strict';
let {CURRENCIES} = require('../lib/constants');
module.exports = function(Exchange) {
  Exchange.observe('after save', function(ctx, next) {
    next();
  });
  Exchange.afterRemote('create', function(context, user, next) {
    next();
  });
  Exchange.listCurrencies = function(callback) {
    callback(null, CURRENCIES);
  };

  Exchange.remoteMethod('listCurrencies', {
    description: 'Get all currency',
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/list', verb: 'get'},
  });
};
