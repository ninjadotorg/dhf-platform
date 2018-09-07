'use strict';

let {PROJECT_STATE} = require('../lib/constants');
module.exports = function(Project) {
  Project.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance.userId = Project.app.currentUserId;
      ctx.instance.refundAmount = 0;
      ctx.instance.pendingAmount = 0;
    }
    if (ctx.instance.state === PROJECT_STATE.READY) {
      ctx.instance.isTransfer = true;
    }
    next();
  });
  Project.observe('after save', function(ctx, next) {
    if (ctx.Model.state === PROJECT_STATE.READY) {
      let async = require('async');
      let exchangeAccount = {};
      let depositAddress = '';
      async.series([
        function pickUpExchangeAccount(next) {
          next();
        },
        function getDepositAddress(next) {
          next();
        },
        function transferMoneyToExchange(next) {
          next();
        },
        function initProject() {
          next();
        },
        function updateProject(next) {
          next();
        },
      ], function onComplete(err) {
        if (err)
          return next(err);
        next();
      });
    }
    next();
  });
  // listProjects
  Project.listProjects = function(callback) {
    Project.find({}, callback);
  };

  Project.myProjects = function(callback) {
    Project.app.models.user.findById(Project.app.currentUserId,
      function(err, user) {
        if (err) callback(err);
        user.project(function(err, projects) {
          if (err) callback(err);
          callback(null, projects);
        });
      });
  };

  Project.remoteMethod('listProjects', {
    description: 'Get all projects',
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/list/all', verb: 'get'},
  });

  Project.remoteMethod('myProjects', {
    description: 'Get all projects of current user',
    returns: {arg: '', root: true, type: 'Object'},
    http: {path: '/list', verb: 'get'},
  });
};
