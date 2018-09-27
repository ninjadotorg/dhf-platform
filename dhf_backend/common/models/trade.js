'use strict';
let async = require('async');
let {TRANSACTION_STATE, PROJECT_STATE} = require('../lib/constants');
let errorHandler = require('../lib/error-handler');
module.exports = function(Trade) {
  Trade.buyLimit = function(projectId, symbol, quantity, price, callback) {
    let currentProject = null;
    let totalAmount = 0;
    let orderResult;
    let error = new Error();
    async.series([
      function validateProject(callback) {
        Trade.app.models.project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 404;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (!project.userId || project.userId.toString() !== Trade.app.currentUserId.toString()) {
            error.status = 404;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          if (project.state !== PROJECT_STATE.RELEASE) {
            error.status = 404;
            error.message = 'Project not ready or finished';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      // function validateOrder(callback) {
      //   totalAmount = quantity * price;
      //   // available amount is subtract of total  from releasedAmount
      //   let availableAmount = currentProject.releasedAmount -
      //     (currentProject.pendingAmount - currentProject.refundAmount);
      //   if (totalAmount > availableAmount) {
      //     error.status = 404;
      //     error.message = 'Your balance of this project was not enough.';
      //     return callback(error);
      //   }
      //   // maybe need more validation here
      //   callback();
      // },
      function callTrade(callback) {
        Trade.action(currentProject.id, 'buyLimit', symbol, quantity, price,
          function(err, resp) {
            if (err) {
              error.message = errorHandler.filler(err);
              error.status = 404;
              return callback(error);
            }
            orderResult = resp;
            callback();
          });
      },
      // function SaveProject(callback) {
      //   currentProject.pendingAmount += totalAmount;
      //   currentProject.save(function(err) {
      //     if (err)
      //       return callback(err);
      //     callback();
      //   });
      // },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, orderResult);
    });
  };

  Trade.sellLimit = function(projectId, symbol, quantity, price, callback) {
    let orderResult;
    let currentProject = null;
    let error = new Error();
    async.series([
      function validateProject(callback) {
        Trade.app.models.project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 404;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (project.userId.toString() !== Trade.app.currentUserId.toString()) {
            error.status = 404;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          if (project.state !== PROJECT_STATE.RELEASE) {
            error.status = 404;
            error.message = 'Project not ready or finished';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      function callTrade(callback) {
        Trade.action(currentProject.id, 'sellLimit', symbol, quantity, price,
          function(err, resp) {
            if (err) {
              error.message = errorHandler.filler(err);
              error.status = 404;
              return callback(error);
            }
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

  Trade.buyMarket = function(projectId, symbol, quantity, callback) {
    let currentProject = null;
    let orderResult;
    let error = new Error();
    async.series([
      function validateProject(callback) {
        Trade.app.models.project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 404;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (project.userId.toString() !== Trade.app.currentUserId.toString()) {
            error.status = 404;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          if (project.state !== PROJECT_STATE.RELEASE) {
            error.status = 404;
            error.message = 'Project not ready or finished';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      function callTrade(callback) {
        Trade.action(currentProject.id, 'buyMarket', symbol, quantity,
          function(err, resp) {
            if (err) {
              error.message = errorHandler.filler(err);
              error.status = 404;
              return callback(error);
            }
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

  Trade.sellMarket = function(projectId, symbol, quantity, callback) {
    let orderResult;
    let currentProject = null;
    let error = new Error();
    async.series([
      function validateProject(callback) {
        Trade.app.models.project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 404;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (project.userId.toString() !== Trade.app.currentUserId.toString()) {
            error.status = 404;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          if (project.state !== PROJECT_STATE.RELEASE) {
            error.status = 404;
            error.message = 'Project not ready or finished';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      function callTrade(callback) {
        Trade.action(currentProject.id, 'sellMarket', symbol, quantity,
          function(err, resp) {
            if (err) {
              error.message = errorHandler.filler(err);
              error.status = 404;
              return callback(error);
            }
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

  Trade.cancel = function(projectId, symbol, orderId, callback) {
    let orderResult;
    let currentProject = null;
    let error = new Error();
    async.series([
      function validateProject(callback) {
        Trade.app.models.project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 404;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (project.userId.toString() !== Trade.app.currentUserId.toString()) {
            error.status = 404;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          if (project.state !== PROJECT_STATE.RELEASE) {
            error.status = 404;
            error.message = 'Project not ready or finished';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      function callTrade(callback) {
        Trade.action(currentProject.id, 'cancelOrder', symbol, null, null, null, orderId,
          function(err, resp) {
            if (err) {
              error.message = errorHandler.filler(err);
              error.status = 404;
              return callback(error);
            }
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

  Trade.myTrades = function(projectId, symbol ='', callback) {
    Trade.action(projectId, 'myTrades', symbol,
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

  Trade.openOrders = function(projectId, symbol = '', callback) {
    Trade.action(projectId, 'openOrders', symbol,
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

  Trade.allOrders = function(projectId, symbol = '', callback) {
    Trade.action(projectId, 'allOrders', symbol,
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

  Trade.listenKey = function(projectId, callback) {
    Trade.getListenKey(projectId, 'getListenKey',
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

  Trade.keepDataStream = function(projectId, listenKey, callback) {
    Trade.dataStream(projectId, 'keepDataStream', listenKey,
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

  Trade.closeDataStream = function(projectId, listenKey, callback) {
    Trade.dataStream(projectId, 'closeDataStream', listenKey,
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

  Trade.remoteMethod(
    'buyLimit',
    {
      description: 'Placing a LIMIT order',
      accepts: [
        {arg: 'projectId', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'quantity', type: 'number', required: true, http: {source: 'form'}},
        {arg: 'price', type: 'number', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/buy-limit'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trade.remoteMethod(
    'sellLimit',
    {
      description: 'Placing a LIMIT order',
      accepts: [
        {arg: 'projectId', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'quantity', type: 'number', required: true, http: {source: 'form'}},
        {arg: 'price', type: 'number', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/sell-limit'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trade.remoteMethod(
    'buyMarket',
    {
      description: 'Placing a  MARKET order',
      accepts: [
        {arg: 'projectId', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'quantity', type: 'number', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/buy-market'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trade.remoteMethod(
    'sellMarket',
    {
      description: 'Placing a MARKET order',
      accepts: [
        {arg: 'projectId', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'symbol', type: 'string', required: true, http: {source: 'form'}},
        {arg: 'quantity', type: 'number', required: true, http: {source: 'form'}},
      ],
      http: {verb: 'POST', path: '/sell-market'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trade.remoteMethod(
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

  Trade.remoteMethod(
    'myTrades',
    {
      description: 'Get all  trade of current user.',
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
        {arg: 'symbol', type: 'string', required: true},
      ],
      http: {verb: 'GET', path: '/my-trades'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trade.remoteMethod(
    'openOrders',
    {
      description: 'Get all open orders of current user.',
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
        {arg: 'symbol', type: 'string'},
      ],
      http: {verb: 'GET', path: '/orders-open'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trade.remoteMethod(
    'allOrders',
    {
      description: 'Get all  orders of current user.',
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
        {arg: 'symbol', type: 'string'},
      ],
      http: {verb: 'GET', path: '/orders'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

   Trade.remoteMethod(
    'listenKey',
    {
      description: 'Get listen key.',
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
      ],
      http: {verb: 'GET', path: '/listen-key'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trade.remoteMethod(
    'keepDataStream',
    {
      description: 'keep data stream.',
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
        {arg: 'listenKey', type: 'string', required: true},
      ],
      http: {verb: 'GET', path: '/keep-data-stream'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Trade.remoteMethod(
    'closeDataStream',
    {
      description: 'Close data stream.',
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
        {arg: 'listenKey', type: 'string', required: true},
      ],
      http: {verb: 'GET', path: '/close-data-stream'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
};
