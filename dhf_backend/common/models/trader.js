'use strict';
let async = require('async');
let {TRANSACTION_STATE, PROJECT_STATE} = require('../lib/constants');
module.exports = function(Trader) {
  Trader.buy = function(projectId, symbol, quantity, price, callback) {
    let currentProject = null;
    let totalAmount = 0;
    let orderResult;
    let error = new Error();
    async.series([
      function validateProject(callback) {
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
          if (project.state !== PROJECT_STATE.RELEASED) {
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
      function saveTrader(callback) {
        Trader.create({
          orderId: null,
          symbol: symbol,
          quantity: quantity,
          price: price,
          flags: 'LIMIT',
          function: 'BUY',
          totalAmount: totalAmount,
          totalMatchedAmount: 0,
          state: PROJECT_STATE.PENDING,
          projectId: currentProject.id,
          userId: Trader.app.currentUserId,
        }, function(err, resp) {
          if (err)
            return callback(err);
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
    let orderResult;
    let currentProject = null;
    let totalAmount = 0;
    let error = new Error();
    async.series([
      function validateProject(callback) {
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
          if (project.state !== PROJECT_STATE.RELEASED) {
            error.status = 404;
            error.message = 'Project not ready or finished';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      function saveTrader(callback) {
        Trader.create({
          orderId: null,
          symbol: symbol,
          quantity: quantity,
          price: price,
          flags: 'LIMIT',
          function: 'SELL',
          totalAmount: totalAmount,
          totalMatchedAmount: 0,
          state: TRANSACTION_STATE.PENDING,
          projectId: currentProject.id,
          userId: Trader.app.currentUserId,
        }, function(err, resp) {
          if (err)
            return callback(err);
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
    let orderResult;
    async.series([
      function validateOrder(callback) {
        // we will verify order here
        console.log('we will verify order here');
        callback();
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
    let orderResult;
    async.series([
      function validateOrder(callback) {
        // we will verify order here
        console.log('we will verify order here');
        callback();
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

  Trader.cancel = function(projectId, symbol, orderId, callback) {
    let orderResult;
    let currentProject = null;
    let currentOrder = null;
    let error = new Error();
    async.series([
      function validateProject(callback) {
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
          if (project.state !== PROJECT_STATE.RELEASED) {
            error.status = 404;
            error.message = 'Project not ready or finished';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      function validateOrder(callback) {
        Trader.findById(orderId, function(err, order) {
          if (err) return callback(err);
          if (!order) {
            error.status = 404;
            error.message = 'Order was not existed!';
            return callback(error);
          }
          if (order.userId.toString() !== Trader.app.currentUserId.toString()) {
            error.status = 404;
            error.message = 'You don\'t have permission on this order';
            return callback(error);
          }
          if (order.projectId.toString() !== currentProject.id.toString()) {
            error.status = 404;
            error.message = 'Order not belong to current project: ' + currentProject.id;
            return callback(error);
          }
          if (order.state === TRANSACTION_STATE.CANCEL) {
            error.status = 404;
            error.message = 'Order was canceled';
            return callback(error);
          }
          if (order.state === TRANSACTION_STATE.DONE) {
            error.status = 404;
            error.message = 'Can not cancel the matched order';
            return callback(error);
          }
          currentOrder = order;
          callback();
        });
      },
      function saveTrader(callback) {
        Trader.create({
          parentId: currentOrder.id,
          orderId: orderId,
          symbol: symbol,
          quantity: 0,
          price: currentOrder.price,
          flags: currentOrder.flags,
          function: currentOrder.function,
          totalAmount: 0,
          totalMatchedAmount: 0,
          state: TRANSACTION_STATE.CANCEL,
          projectId: currentProject.id,
          userId: Trader.app.currentUserId,
        }, function(err, resp) {
          if (err)
            return callback(err);
          if (!orderResult || !orderResult.orderId)
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

  Trader.cancelAll = function(symbol, orderid, callback) {
    let orderResult;
    async.series([
      function validateOrder(callback) {
        // we will verify order here
        console.log('we will verify order here');
        callback();
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
        {arg: 'orderId', type: 'string', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/cancel'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trader.remoteMethod(
    'cancelAll',
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
