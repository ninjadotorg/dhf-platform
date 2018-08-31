'use strict';
var async = require('async');
var errorHandler = require('../lib/error-handler');
module.exports = function(Trader) {
  Trader.buy = function(projectId, symbol, quantity, price, callback) {
    const binance = require('../lib/binance')(Trader.app).binance;
    let orderResult;
    let currentProject = null;
    let totalAmount = 0;
    let error = new Error();
    async.series([
      function validateProduct(callback) {
        Trader.app.models.project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 404;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (project.userId.toString() !== Trader.app.currentUserId.toString()) {
            error.status = 404;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          if (project.state !== 'RELEASEED') {
            error.status = 404;
            error.message = 'Project not ready or finished';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      function validateOrder(callback) {
        totalAmount = quantity * price;
        // available amount is subtract of total  from releasedAmount
        let availableAmount = currentProject.releasedAmount -
          (currentProject.pendingAmount - currentProject.refundAmount);
        if (totalAmount > availableAmount) {
          error.status = 404;
          error.message = 'Your balance of this project was not enough.';
          return callback(error);
        }
        // maybe need more validation here
        callback();
      },
      function buy(callback) {
        new Promise(function(resolve, reject) {
          binance.buy(symbol, quantity, price, {type: 'LIMIT'}, function(err, result) {
            if (err) {
              err = errorHandler.filler(err);
              error.status = 404;
              error.message = err;
              return callback(error);
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
        let orderId;
        if (!orderResult.orderId) { // only for test
          orderId = 'test_' + Math.random();
        } else {
          orderId = orderResult.orderId;
        }
        Trader.create({
          orderId: orderId,
          symbol: symbol,
          quantity: quantity,
          price: price,
          flags: 'LIMIT',
          function: 'BUY',
          totalAmount: totalAmount,
          totalMatchedAmount: 0,
          state: 'PENDING',
          projectId: currentProject.id,
          userId: Trader.app.currentUserId,
        }, function(err, resp) {
          if (err)
            return callback(err);
          if (!orderResult.orderId)
            orderResult = resp;
          callback();
        });
      },
      function SaveProject(callback) {
        currentProject.pendingAmount += totalAmount;
        currentProject.save(function(err) {
          if (err)
            return callback(err);
          callback();
        });
      },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, orderResult);
    });
  };

  Trader.sell = function(projectId, symbol, quantity, price, callback) {
    const binance = require('../lib/binance')(Trader.app).binance;
    let orderResult;
    let currentProject = null;
    let totalAmount = 0;
    let error = new Error();
    async.series([
      function validateProduct(callback) {
        Trader.app.models.project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 404;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (project.userId.toString() !== Trader.app.currentUserId.toString()) {
            error.status = 404;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          if (project.state !== 'RELEASEED') {
            error.status = 404;
            error.message = 'Project not ready or finished';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      function sell(callback) {
        new Promise(function(resolve) {
          binance.sell(symbol, quantity, price, {type: 'LIMIT'}, function(err, result) {
            if (err) {
              err = errorHandler.filler(err);
              error.status = 404;
              error.message = err;
              return callback(error);
            } else {
              orderResult = result;
              resolve(result);
            }
          });
        }).then(function() {
          callback();
        });
      },
      function saveTrader(callback) {
        let orderId;
        if (!orderResult.orderId) { // only for test
          orderId = 'test_' + Math.random();
        } else {
          orderId = orderResult.orderId;
        }
        Trader.create({
          orderId: orderId,
          symbol: symbol,
          quantity: quantity,
          price: price,
          flags: 'LIMIT',
          function: 'SELL',
          totalAmount: totalAmount,
          totalMatchedAmount: 0,
          state: 'PENDING',
          projectId: currentProject.id,
          userId: Trader.app.currentUserId,
        }, function(err, resp) {
          if (err)
            return callback(err);
          if (!orderResult.orderId)
            orderResult = resp;
          callback();
        });
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
        {arg: 'projectId', type: 'string', required: true, http: {source: 'form'}},
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
        {arg: 'projectId', type: 'string', required: true, http: {source: 'form'}},
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
        {arg: 'projectId', type: 'string', required: true, http: {source: 'form'}},
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
        {arg: 'projectId', type: 'string', required: true, http: {source: 'form'}},
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
        {arg: 'projectId', type: 'string', required: true, http: {source: 'form'}},
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
        {arg: 'projectId', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/cancel-all'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
};
