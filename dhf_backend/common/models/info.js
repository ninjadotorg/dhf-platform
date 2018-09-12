'use strict';
let errorHandler = require('../lib/error-handler');
module.exports = function(Info) {
  Info.exchangeInfo = function(callback) {
    const binance = require('../lib/binance')(Info.app).binance;
    binance.exchangeInfo(function(err, resp) {
      if (err)
        return callback(err);
      callback(null, resp);
    });
  };
  Info.remoteMethod(
    'exchangeInfo',
    {
      accepts: [],
      http: {
        verb: 'GET',
        path: '/exchange-info',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Info.depositHistory = function(callback) {
    const binance = require('../lib/binance')(Info.app).binance;
    binance.depositHistory(function(err, resp) {
      if (err)
        return callback(err);
      callback(null, resp);
    });
  };
  Info.remoteMethod(
    'depositHistory',
    {
      accepts: [],
      http: {
        path: '/deposit-history',
        verb: 'GET',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Info.prices = function(callback) {
    const binance = require('../lib/binance')(Info.app).binance;
    binance.prices(function(err, resp) {
      if (err)
        return callback(err);
      callback(null, resp);
    });
  };
  Info.remoteMethod(
    'prices',
    {
      accepts: [],
      http: {
        verb: 'GET',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Info.balance = function(projectId, currency, callback) {
    Info.app.models.trade.action(projectId, 'getBalance', null, null, null, currency,
      function(err, resp) {
        if (err) {
          let error = new Error();
          error.message = errorHandler.filler(err);
          error.status = 404;
          return callback(error);
        }
        callback(resp);
      });
  };
  Info.remoteMethod(
    'balance',
    {
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
        {arg: 'currency', type: 'string'},
      ],
      http: {
        verb: 'GET',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
  Info.status = function(callback) {
    callback(null, {'I\'m': 'Okie!', 'Your ID is': Info.app.currentUserId});
  };
  Info.remoteMethod(
    'status',
    {
      accepts: [],
      http: {
        verb: 'GET',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
};
