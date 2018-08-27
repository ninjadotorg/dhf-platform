'use strict';

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
        verb: 'GET',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Info.status = function(callback) {
    callback(null, 'I\'m Okie!');
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
