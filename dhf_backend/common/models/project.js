'use strict';
let async = require('async');
let {PROJECT_STATE} = require('../lib/constants');
module.exports = function(Project) {
  Project.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance.userId = Project.app.currentUserId;
      ctx.instance.refundAmount = 0;
      ctx.instance.pendingAmount = 0;
    }
    if (ctx.instance && ctx.instance.state === PROJECT_STATE.READY) {
      ctx.instance.isTransfer = false;
    }
    if (ctx.data && ctx.data.state === PROJECT_STATE.READY) {
      ctx.data.isTransfer = false;
    }
    next();
  });
  Project.observe('after save', function(ctx, next) {
    if (ctx.instance.state === PROJECT_STATE.READY &&
      (!ctx.instance.depositAddress || ctx.instance.depositAddress === '')) {
      let depositAddress = '';
      async.series([
        function pickUpExchangeAccount(calback) {
          Project.app.models.trader.getOrSetAccount(
            ctx.instance.id,
            ctx.instance.exchange,
            ctx.instance.currency, function(err, data) {
              if (err) return calback(err);
              depositAddress = data.despositAddress;
              calback();
            });
        },
        function transferMoneyToExchange(callback) {
          callback();
        },
      ], function onComplete(err) {
        if (err)
          return next(err);
        ctx.instance.updateAttributes({depositAddress: depositAddress});
        next();
      });
    }
    next();
  });
  // listProjects
  Project.listProjects = function(userId, isFunding, callback) {
    let fiter = {where: {}};
    if (userId) fiter.where.userId = userId;
    if (isFunding) fiter.where.state = PROJECT_STATE.READY;
    Project.find(fiter, callback);
  };

  Project.myProjects = function(isTrading, callback) {
    let fiter = {where: {
      userId: Project.app.currentUserId,
    }};

    if (isTrading) fiter.where.state = PROJECT_STATE.RELEASED;
    Project.find(fiter, callback);
  };

  Project.remoteMethod('listProjects', {
    description: 'Get all projects',
    accepts: [
      {arg: 'userId', type: 'string'},
      {arg: 'isFunding', type: 'boolean'},
    ],
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/list/all', verb: 'get'},
  });

  Project.remoteMethod('myProjects', {
    description: 'Get all projects of current user',
    accepts: [
      {arg: 'isTrading', type: 'boolean'},
    ],
    returns: {arg: '', root: true, type: 'Object'},
    http: {path: '/list', verb: 'get'},
  });
};
