'use strict';
let errorHandler = require('../lib/error-handler');
module.exports = function(Info) {
  Info.exchangeInfo = function(projectId, callback) {
    Info.app.models.trade.action(projectId, 'exchangeInfo',
      function(err, resp) {
        if (err) {
          let error = new Error();
          error.message = errorHandler.filler(err);
          error.status = 404;
          return callback(error);
        }
        callback(null, resp);
      });
  };
  Info.remoteMethod(
    'exchangeInfo',
    {
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
      ],
      http: {
        verb: 'GET',
        path: '/exchange-info',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Info.depositHistory = function(projectId, callback) {
    Info.app.models.trade.action(projectId, 'depositHistory',
      function(err, resp) {
        if (err) {
          let error = new Error();
          error.message = errorHandler.filler(err);
          error.status = 404;
          return callback(error);
        }
        callback(null, resp);
      });
  };
  Info.remoteMethod(
    'depositHistory',
    {
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
      ],
      http: {
        path: '/deposit-history',
        verb: 'GET',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Info.prices = function(projectId, callback) {
    Info.app.models.trade.action(projectId, 'getPrices',
      function(err, resp) {
        if (err) {
          let error = new Error();
          error.message = errorHandler.filler(err);
          error.status = 404;
          return callback(error);
        }
        callback(null, resp);
      });
  };
  Info.remoteMethod(
    'prices',
    {
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
      ],
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
        callback(null, resp);
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
