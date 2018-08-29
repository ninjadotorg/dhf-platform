'use strict';
var async = require('async');
var errorHandler = require('../lib/error-handler');
module.exports = function(Trader) {
  Trader.buy = function(symbol, quantity, price, callback) {
    const binance = require('../lib/binance')(Trader.app).binance;
    let orderResult;
    async.series([
      function validateOrder(callback) {
        // we will verify order here
        callback();
      },
      function buy(callback) {
        new Promise(function(resolve, reject) {
          binance.buy(symbol, quantity, price, {type: 'LIMIT'}, function(err, result) {
            if (err) {
              err = errorHandler.filler(err);
              callback(err);
            } else {
              orderResult = result;
              resolve(result);
            }
          });
        }).then(function(resp) {
          callback();
        });
      },
      function saveTrader(callback) {
        // we will tracking order here
        callback();
      },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, orderResult);
    });
  };

  Trader.sell = function(symbol, quantity, price, callback) {
    const binance = require('../lib/binance')(Trader.app).binance;
    let orderResult;
    async.series([
      function validateOrder(callback) {
        // we will verify order here
        console.log('we will verify order here');
        callback();
      },
      function buy(callback) {
        new Promise(function(resolve, reject) {
          binance.sell(symbol, quantity, price, {type: 'LIMIT'}, function(err, result) {
            if (err) {
              err = errorHandler.filler(err);
              callback(err);
            } else {
              orderResult = result;
              resolve(result);
            }
          });
        }).then(function(resp) {
          callback();
        });
      },
      function saveTrader(callback) {
        // we will tracking order here
        callback();
      },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, orderResult);
    });
  };

  Trader.marketBuy = function(symbol, quantity, callback) {
    const binance = require('../lib/binance')(Trader.app).binance;
    let orderResult;
    async.series([
      function validateOrder(callback) {
        // we will verify order here
        console.log('we will verify order here');
        callback();
      },
      function buy(callback) {
        new Promise(function(resolve, reject) {
          binance.marketBuy(symbol, quantity, {type: 'LIMIT'}, function(err, result) {
            if (err) {
              err = errorHandler.filler(err);
              callback(err);
            } else {
              orderResult = result;
              resolve(result);
            }
          });
        }).then(function(resp) {
          callback();
        });
      },
      function saveTrader(callback) {
        // we will tracking order here
        callback();
      },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, orderResult);
    });
  };

  Trader.marketSell = function(symbol, quantity, callback) {
    const binance = require('../lib/binance')(Trader.app).binance;
    let orderResult;
    async.series([
      function validateOrder(callback) {
        // we will verify order here
        console.log('we will verify order here');
        callback();
      },
      function buy(callback) {
        new Promise(function(resolve, reject) {
          binance.marketSell(symbol, quantity, {type: 'LIMIT'}, function(err, result) {
            if (err) {
              err = errorHandler.filler(err);
              callback(err);
            } else {
              orderResult = result;
              resolve(result);
            }
          });
        }).then(function(resp) {
          callback();
        });
      },
      function saveTrader(callback) {
        // we will tracking order here
        callback();
      },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, orderResult);
    });
  };

  Trader.cancel = function(symbol, orderid, callback) {
    const binance = require('../lib/binance')(Trader.app).binance;
    let orderResult;
    async.series([
      function validateOrder(callback) {
        // we will verify order here
        console.log('we will verify order here');
        callback();
      },
      function buy(callback) {
        new Promise(function(resolve, reject) {
          binance.cancel(symbol, orderid, {type: 'LIMIT'}, function(err, result) {
            if (err) {
              err = errorHandler.filler(err);
              callback(err);
            } else {
              orderResult = result;
              resolve(result);
            }
          });
        }).then(function(resp) {
          callback();
        });
      },
      function saveTrader(callback) {
        // we will tracking order here
        callback();
      },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, orderResult);
    });
  };

  Trader.cancel = function(symbol, orderid, callback) {
    const binance = require('../lib/binance')(Trader.app).binance;
    let orderResult;
    async.series([
      function validateOrder(callback) {
        // we will verify order here
        console.log('we will verify order here');
        callback();
      },
      function buy(callback) {
        new Promise(function(resolve, reject) {
          binance.cancel(symbol, orderid, {type: 'LIMIT'}, function(err, result) {
            if (err) {
              err = errorHandler.filler(err);
              callback(err);
            } else {
              orderResult = result;
              resolve(result);
            }
          });
        }).then(function(resp) {
          callback();
        });
      },
      function saveTrader(callback) {
        // we will tracking order here
        callback();
      },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, orderResult);
    });
  };

  Trader.remoteMethod(
    'buy',
    {
      description: 'Placing a LIMIT or a MARKET order',
      accepts: [
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'quantity', type: 'number', required: true, http: {source: 'form'}},
        {arg: 'price', type: 'number', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/buy'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trader.remoteMethod(
    'marketBuy',
    {
      description: 'Placing a LIMIT or a MARKET order',
      accepts: [
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'quantity', type: 'number', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/market-buy'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trader.remoteMethod(
    'sell',
    {
      description: 'Placing a LIMIT or a MARKET order',
      accepts: [
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'quantity', type: 'number', required: true, http: {source: 'form'}},
        {arg: 'price', type: 'number', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/sell'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trader.remoteMethod(
    'marketSell',
    {
      description: 'Placing a LIMIT or a MARKET order',
      accepts: [
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'quantity', type: 'number', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/market-sell'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trader.remoteMethod(
    'cancel',
    {
      description: 'cancel an order',
      accepts: [
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'orderid', type: 'string', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/cancel'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trader.remoteMethod(
    'cancel',
    {
      description: 'Cancel all open orders of symbol.',
      accepts: [
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/cancel-all'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
};
