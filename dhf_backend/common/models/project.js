'use strict';
let errorHandler = require('../lib/error-handler');
let {PROJECT_STATE} = require('../lib/constants');
module.exports = function(Project) {
  Project.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance.userId = Project.app.currentUserId;
      ctx.instance.refundAmount = 0;
      ctx.instance.pendingAmount = 0;
      Project.app.models.smartContract.smartContactGetVersion('currentVersion',
        function(err, data) {
          if (err) {
            let error = new Error();
            error.message = errorHandler.filler(err);
            error.status = 404;
            return next(error);
          }
          ctx.instance.smartContractVersion = data.version;
          next();
        });
    } else {
      next();
    }
  });
  Project.observe('after save', function(ctx, next) {
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
